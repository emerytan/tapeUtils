#!/bin/bash

clear

tempBase=$(basename "$1" | sed 's/md5/txt/')
tempFile="/tmp/$tempBase"


if [ -e "$tempFile" ]; then
	echo "tempFile exists"
	rm "$tempFile"
	touch "tempFile"
	echo -e "writing temp file to: ${tempFile}"
	sleep 5
else
	touch "tempFile"
	echo -e "writing temp file to: ${tempFile}"
	sleep 5
fi

while read -r HASH FILE; do 
	if (! grep "$HASH" "$2"); then 
		echo -e "${HASH} ${FILE}\tFAIL" | tee -a "$tempFile"
		sleep 3
	fi

	# result=$(grep "$HASH" "$2")
	# if [[ $result = "" ]]; then 
	# 	echo -e "${HASH}  ${FILE}\tFAIL" | tee -a "$tempFile"
	# 	sleep 3
	# else
	# 	echo -e "${result}\tPASS"
	# fi
done < "$1"


echo -e "\n\nFailed hash matches..."
cat "$tempFile"

exit
