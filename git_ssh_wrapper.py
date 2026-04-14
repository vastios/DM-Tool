#!/usr/bin/env python3
"""A drop-in git SSH wrapper that uses paramiko instead of ssh binary."""
import paramiko
import sys
import os
import subprocess
import threading
import struct
import select
import socket
import signal

KEY_PATH = "/home/z/.ssh/dm-tool-deploy"

def main():
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} [user@]host command", file=sys.stderr)
        sys.exit(1)

    # Parse arguments - git calls: this-script [user@]host "git-receive-pack 'repo.git'"
    host_arg = sys.argv[1]
    cmd = sys.argv[2]

    # Parse host
    if "@" in host_arg:
        username, hostname = host_arg.split("@", 1)
    else:
        username = "git"
        hostname = host_arg
    
    # Parse port
    if ":" in hostname:
        hostname, port_str = hostname.rsplit(":", 1)
        # Git uses ssh-style :port, convert
        try:
            port = int(port_str)
        except ValueError:
            port = 22
            hostname = hostname + ":" + port_str
    else:
        port = 22

    # Load key
    try:
        key = paramiko.RSAKey.from_private_key_file(KEY_PATH)
    except:
        key = paramiko.Ed25519Key.from_private_key_file(KEY_PATH)

    # Connect
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((hostname, port))

    transport = paramiko.Transport(sock)
    transport.connect(username=username, pkey=key)

    channel = transport.open_session()
    channel.exec_command(cmd)

    # Pipe stdin/stdout/stderr
    def pipe_to_channel():
        try:
            while True:
                data = sys.stdin.buffer.read(4096)
                if not data:
                    break
                channel.sendall(data)
        except:
            pass
        channel.shutdown_write()

    def pipe_from_channel():
        try:
            while True:
                if channel.recv_ready():
                    data = channel.recv(4096)
                    if not data:
                        break
                    sys.stdout.buffer.write(data)
                    sys.stdout.buffer.flush()
                if channel.recv_stderr_ready():
                    data = channel.recv_stderr(4096)
                    if not data:
                        break
                    sys.stderr.buffer.write(data)
                    sys.stderr.buffer.flush()
                if channel.exit_status_ready():
                    break
                select.select([channel], [], [], 0.1)
        except:
            pass

    t1 = threading.Thread(target=pipe_to_channel, daemon=True)
    t2 = threading.Thread(target=pipe_from_channel, daemon=True)
    
    t1.start()
    t2.start()
    
    t2.join(timeout=120)
    
    exit_code = channel.recv_exit_status() if channel.exit_status_ready() else 1
    
    channel.close()
    transport.close()
    
    sys.exit(exit_code)

if __name__ == "__main__":
    main()
