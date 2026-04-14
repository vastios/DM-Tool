#!/usr/bin/env python3
"""Push to GitHub via paramiko - custom git SSH transport."""
import paramiko
import subprocess
import sys
import os
import struct
import select

REPO_DIR = "/home/z/my-project/DM-Tool"
KEY_PATH = "/home/z/.ssh/dm-tool-deploy"
REMOTE_REPO = "vastios/DM-Tool.git"

def pkt_line(data):
    """Encode a pkt-line."""
    if isinstance(data, str):
        data = data.encode()
    length = len(data) + 4
    return struct.pack(">I", length) + data

def pkt_flush():
    return b"0000"

def recv_pkt_line(channel, timeout=5):
    """Receive a pkt-line from channel."""
    buf = b""
    while True:
        ready, _, _ = select.select([channel], [], [], timeout)
        if not ready:
            return None
        d = channel.recv(4096)
        if not d:
            return None
        buf += d
        if len(buf) >= 4:
            length = struct.unpack(">I", buf[:4])[0]
            if length == 0:
                return b""
            if len(buf) >= length:
                return buf[4:length]

def main():
    os.chdir(REPO_DIR)

    # Get current branch and refs
    branch = subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"], text=True).strip()
    local_sha = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
    
    # Get remote ref
    result = subprocess.run(["git", "ls-remote", f"https://github.com/{REMOTE_REPO}", branch], 
                          capture_output=True, text=True, timeout=15)
    if result.returncode != 0:
        print(f"Error getting remote ref: {result.stderr}")
        sys.exit(1)
    
    remote_sha = result.stdout.strip().split()[0] if result.stdout.strip() else "0" * 40

    # Connect via SSH
    key = paramiko.RSAKey.from_private_key_file(KEY_PATH)
    transport = paramiko.Transport(("github.com", 22))
    transport.connect(username="git", pkey=key)

    channel = transport.open_session()
    channel.exec_command(f"git-receive-pack '/{REMOTE_REPO}'")

    # Read server hello
    server_lines = []
    while True:
        pkt = recv_pkt_line(channel)
        if pkt is None:
            break
        if pkt == b"":
            break
        server_lines.append(pkt.decode("utf-8", errors="replace").strip())

    for line in server_lines:
        if line.strip():
            print(f"< {line.strip()}")

    # Send update command: old_sha new_sha ref
    update_cmd = f"{remote_sha} {local_sha} refs/heads/{branch}\0report-status agent=push-via-paramiko\n"
    channel.sendall(pkt_line(update_cmd))
    channel.sendall(pkt_flush())

    # Send packfile
    pack_result = subprocess.run(
        ["git", "pack-objects", "--all-progress-implied", "--revs", "--stdout"],
        input=f"{remote_sha}\n{local_sha}\n".encode(),
        capture_output=True, timeout=60
    )

    if pack_result.returncode != 0:
        print(f"Error creating pack: {pack_result.stderr.decode()}")
        transport.close()
        sys.exit(1)

    # Send packfile header
    pack_data = pack_result.stdout
    channel.sendall(pkt_line(f"Packing {len(pack_data)} bytes\n"))
    channel.sendall(pack_data)

    # Read server response
    import time
    time.sleep(1)
    response = b""
    while select.select([channel], [], [], 3)[0]:
        d = channel.recv(4096)
        if not d:
            break
        response += d

    print(f"\nServer response: {response.decode('utf-8', errors='replace')}")

    channel.close()
    transport.close()
    
    # Update local refs
    subprocess.run(["git", "fetch", "origin", branch], capture_output=True, timeout=15)
    print(f"\nPushed {local_sha[:8]} to {REMOTE_REPO} ({branch})")

if __name__ == "__main__":
    main()
