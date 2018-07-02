#!/bin/bash


outDir="/tmp/pfTapeUtils"
origHash="$1"
baseDir="$2"
jobRef=$(basename "${1}" | sed 's/.md5//')
outFile="$outDir/${jobRef}.md5"


if [ -e "$outFile" ]; then
    echo -e "removing old temp file..."
    rm -v "$outFile"
    touch "$outFile"
else
    echo -e "creating temp file...\n"
    touch "$outFile"
fi

echo "initializing..." | tee -a "$outFile"
echo -e "hashFile: $origHash"
echo -e "jobRef: $jobRef"
echo -e "baseDir: $baseDir"
echo -e "outFile: $outFile\n"


cd "$baseDir"
echo -e "are we in baseDir: $PWD"
echo -e "starting in 3 seconds"
sleep 2

lineCount=$(wc -l "$origHash" | awk '{ print $1 }')
echo -e "lines: $lineCount"
count=0
sort -k 2 $origHash | while read HASH FILE; do
    (( count ++ ))
    FL=$(basename $FILE)
    find . -type f -name "$FL" -print0 | xargs -0 md5 -r | tee -a "$outFile"
    echo -e "count: $count"
done

exit
