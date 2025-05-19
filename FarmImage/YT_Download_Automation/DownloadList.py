import yt_dlp

class downloadList:
    def __init__():
        #!/usr/bin/env python3
        """
        Script to generate a yts.txt file containing 30 YouTube video URLs
        with minimum duration ~30 minutes, max size 1GB, format up to 720p MP4.
        """

    def main():
        # Search query: adjust keywords as needed
        query = 'long documentary OR lecture OR tutorial'
        # yt-dlp options
        ydl_opts = {
            'format': 'bestvideo[height<=720]+bestaudio/best[height<=720]',  # up to 720p MP4
            'max_filesize': 1_000_000_000,  # 1 GB in bytes
            'ignoreerrors': True,  # skip errors
            'quiet': True,         # minimal output
            'extract_flat': True,  # do not download, only metadata
        }

        # Perform search and extract IDs
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            search_term = f'ytsearch30:{query}'
            info = ydl.extract_info(search_term, download=False)

        video_ids = []
        for entry in info.get('entries', []):
            if not entry:
                continue
            vid = entry.get('id')
            duration = entry.get('duration')
            # Filter duration >= 1800 seconds (~30 min)
            if vid and duration and duration >= 1800:
                video_ids.append(vid)
            if len(video_ids) >= 30:
                break

        # Write to yts.txt
        with open('yts.txt', 'w') as f:
            for vid in video_ids:
                f.write(f'https://www.youtube.com/watch?v={vid}\n')

        print(f"Written {len(video_ids)} URLs to yts.txt")
