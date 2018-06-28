#!/bin/bash

origHash="$1"

sort -k 2 $origHash | while read hash orig; do
    FL=$(basename $orig)
    CSF=$(find . -name $FL)
    NH=$(md5sum $CSF)
    nh=$(echo $NH | awk '{ print $1 }' | tr a-z A-Z)
    echo -e "$FL\n$hash\n$NH\n$nh"
    if [[ "$hash" = "$nh" ]]; then
        echo -e "OK\n"
    else
        echo -e "FAIL\n"
    fi
done
