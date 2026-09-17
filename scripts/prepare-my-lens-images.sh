#!/bin/sh
set -eu

src_dir="static/images/about/my-lens"
web_dir="$src_dir/web"
data_dir="data"
data_file="$data_dir/my_lens_images.json"

tmp_dir=$(mktemp -d)
trap 'rm -rf "$tmp_dir"' EXIT HUP INT TERM

sorted_sources="$tmp_dir/sources.tsv"
manifest="$tmp_dir/my_lens_images.json"

find "$src_dir" -maxdepth 1 -type f \( -iname '*.heic' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' -o -iname '*.png' \) -print |
  awk -F/ '
    {
      filename = $NF
      if (filename ~ /^lens-/) next

      stem = filename
      sub(/\.[^.]+$/, "", stem)
      if (stem !~ /^[0-9]+(\.[0-9]+)?$/) next

      count = split(stem, parts, ".")
      main = parts[1] + 0
      has_subnumber = count > 1 ? 1 : 0
      subnumber = has_subnumber ? parts[2] + 0 : 0
      printf "%012d-%d-%012d\t%s\n", main, has_subnumber, subnumber, filename
    }
  ' |
  LC_ALL=C sort > "$sorted_sources"

if [ ! -s "$sorted_sources" ]; then
  echo "No numerically named My Lens images found in $src_dir" >&2
  exit 1
fi

rm -rf "$web_dir"
mkdir -p "$web_dir" "$data_dir"

convert_image() {
  src="$1"
  dest="$2"

  case "$src" in
    *.heic|*.HEIC)
      if ! command -v heif-convert >/dev/null 2>&1; then
        echo "Missing HEIC converter: install libheif to provide heif-convert." >&2
        exit 1
      fi
      intermediate="$tmp_dir/$(basename "$dest")"
      heif-convert "$src" "$intermediate" >/dev/null
      sips -s format jpeg -s formatOptions 86 -Z 1800 "$intermediate" --out "$dest" >/dev/null
      ;;
    *)
      sips -s format jpeg -s formatOptions 86 -Z 1800 "$src" --out "$dest" >/dev/null
      ;;
  esac
}

printf '[\n' > "$manifest"
entry_count=0

while IFS="$(printf '\t')" read -r _ filename; do
  stem=${filename%.*}
  output_name="$stem.jpg"
  convert_image "$src_dir/$filename" "$web_dir/$output_name"

  if [ "$entry_count" -gt 0 ]; then
    printf ',\n' >> "$manifest"
  fi
  printf '  { "image": "/images/about/my-lens/web/%s", "alt": "My Lens photo %s" }' "$output_name" "$stem" >> "$manifest"
  entry_count=$((entry_count + 1))
done < "$sorted_sources"

printf '\n]\n' >> "$manifest"
mv "$manifest" "$data_file"

echo "Prepared $entry_count My Lens browser-compatible JPEG images in $web_dir"
