import os
import random
import socket
import struct


# nft add table filter
# nft add chain filter INPUT {type filter hook INPUT priority 0;}

for i in range(100):
    prot = "tcp" if random.randint(0, 1) else "udp"
    ip_src = socket.inet_ntoa(struct.pack(">I", random.randint(1, 0xFFFFFFFF)))
    ip_dst = socket.inet_ntoa(struct.pack(">I", random.randint(1, 0xFFFFFFFF)))
    p_src = 3000
    d_src = 4000
    cmd = f"nft add rule filter INPUT ip protocol {prot} ip saddr {ip_src} ip daddr {ip_dst} "
    print(cmd)
    os.system(
        cmd
    )

