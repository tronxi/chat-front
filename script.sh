#!/bin/bash
sed -i 's/href="\/"/href="${baseRef}"/g' /usr/share/nginx/html/index.html
