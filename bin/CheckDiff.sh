#!/bin/bash

clear

diff <(cat $1 | grep -E '.dpx$' | sort -k 2) <(cat $2 | grep -E '.dpx$' | sort -k 2)

exit


