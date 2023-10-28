#!/bin/bash
# macos variant 
ps -axcro '%cpu,%mem,pid,time,user,comm' | head -n 10 | awk '{print $1","$2","$3","$4","$5","$6" "$7" "$8}'

#unbuntu variant
# ps -axco '%cpu,%mem,pid,time,user,comm' --sort -%cpu | head -n 10 | awk '{print $1","$2","$3","$4","$5","$6" "$7" "$8}'
