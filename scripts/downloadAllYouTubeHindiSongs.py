import subprocess
import json
import os
import sys
import math

TRACKS = [
    {"id": "track-1", "query": "ytsearch1:Kesariya Brahmastra full song audio Arijit Singh"},
    {"id": "track-2", "query": "ytsearch1:Chaap Tilak Coke Studio Rahat Fateh Ali Khan Amjad Sabri official audio"},
    {"id": "track-3", "query": "ytsearch1:Dil Mere The Local Train official audio song"},
    {"id": "track-4", "query": "ytsearch1:Tum Hi Ho Aashiqui 2 Arijit Singh full song audio"},
    {"id": "track-5", "query": "ytsearch1:Raataan Lambiyan Shershaah full song audio Jubin Nautiyal"},
    {"id": "track-6", "query": "ytsearch1:Chura Liya Hai Tumne Jo Dil Ko original song audio Asha Bhosle Mohammed Rafi"},
    {"id": "track-7", "query": "ytsearch1:Baarishein Anuv Jain official song audio"},
    {"id": "track-8", "query": "ytsearch1:Ilahi Yeh Jawaani Hai Deewani full song audio Arijit Singh"},
    {"id": "track-9", "query": "ytsearch1:Kahani Suno 2.0 Kaifi Khalil official audio song"},
    {"id": "track-10", "query": "ytsearch1:Shayad Love Aaj Kal full song audio Arijit Singh"},
    {"id": "track-11", "query": "ytsearch1:Apna Bana Le Bhediya full song audio Arijit Singh"},
    {"id": "track-12", "query": "ytsearch1:Pasoori Coke Studio Ali Sethi Shae Gill official audio"},
    {"id": "track-13", "query": "ytsearch1:Kun Faya Kun Rockstar full song audio A R Rahman"},
    {"id": "track-14", "query": "ytsearch1:Agar Tum Saath Ho Tamasha full song audio Alka Yagnik Arijit Singh"},
    {"id": "track-15", "query": "ytsearch1:O Maahi Dunki full song audio Arijit Singh"},
    {"id": "track-16", "query": "ytsearch1:Tu Hai Kahan AUR official song audio"},
    {"id": "track-17", "query": "ytsearch1:Pehle Bhi Main Animal Vishal Mishra full song audio"},
    {"id": "track-18", "query": "ytsearch1:Husn Anuv Jain official song audio"},
    {"id": "track-19", "query": "ytsearch1:Tere Hawaale Laal Singh Chaddha full song audio Arijit Singh"},
    {"id": "track-20", "query": "ytsearch1:Jo Tum Mere Ho Anuv Jain official song audio"},
    {"id": "track-21", "query": "ytsearch1:Kesariya Balam Aao Ji Padharo Mhare Desh original song audio"},
    {"id": "track-22", "query": "ytsearch1:Moko Kahan Dhoondhe Re Bande Kabir Bhajan audio song"},
    {"id": "track-23", "query": "ytsearch1:Piya Tose Naina Lage Re Guide Lata Mangeshkar original song audio"},
    {"id": "track-24", "query": "ytsearch1:Babul Mora Naihar Chhooto Jaye KL Saigal original song audio"},
]

output_dir = os.path.abspath("public/audio")
results = {}

for t in TRACKS:
    tid = t["id"]
    target_m4a = os.path.join(output_dir, f"{tid}.m4a")
    if os.path.exists(target_m4a) and os.path.getsize(target_m4a) > 500000:
        print(f"Skipping {tid}, already exists ({os.path.getsize(target_m4a)} bytes)")
    else:
        out_tmpl = os.path.join(output_dir, f"{tid}.%(ext)s")
        print(f"Downloading {tid}: {t['query']}...")
        cmd = [
            sys.executable, "-m", "yt_dlp",
            "--js-runtimes", "node:/opt/homebrew/bin/node",
            "-f", "ba[ext=m4a]/ba",
            "-o", out_tmpl,
            "--no-playlist",
            t["query"]
        ]
        try:
            subprocess.run(cmd, check=True)
        except Exception as e:
            print(f"Error downloading {tid}: {e}")

    # Read duration
    if os.path.exists(target_m4a):
        afinfo = subprocess.run(["afinfo", target_m4a], capture_output=True, text=True)
        duration = 0
        for line in afinfo.stdout.splitlines():
            if "estimated duration" in line:
                try:
                    duration = math.ceil(float(line.split(":")[1].strip().split()[0]))
                except Exception:
                    pass
        results[tid] = {
            "file": f"/audio/{tid}.m4a",
            "duration": duration,
            "size": os.path.getsize(target_m4a)
        }
        print(f"  {tid} duration: {duration}s")

with open(os.path.join(output_dir, "metadata.json"), "w") as f:
    json.dump(results, f, indent=2)

print("\nSuccessfully finished all downloads! Metadata written to metadata.json")
