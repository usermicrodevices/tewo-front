#!/bin/sh

npm run build
cp -r build video
sftp root@web.wellbell.io <<EOF
put -r video /home
exit
EOF

rm -rf video
