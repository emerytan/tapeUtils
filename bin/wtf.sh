#!bin/bash

# read md5 file & compare to live checksum output from find.



diff <(cat $1 | cut -d" " -f 1) <(find $2 -type f -print0 | xargs -0 md5sum | cut -d" " -f1)


while read hash longp; do 
  thisFile=$(basename $longp)
  echo "$hash ./files/$thisFile" | md5sum -c - | grep -i fail
done < some.md5

