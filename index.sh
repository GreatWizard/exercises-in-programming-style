#!/bin/sh

mkdir -p tmp

DIRS=("03-monolithic")
FILES=('input.txt' 'pride-and-prejudice.txt' 'test.txt')

for d in ${DIRS[@]} ; do
    for f in ${FILES[@]} ; do
        node "$d/index.js" $f > "./tmp/$f"
        diff "./tmp/$f" "./tests/$f"
        if [ $? -eq 0 ]; then
            echo "✔️  Ok for $d with $f"
        else
            echo "❌ Errors for $d with $f"
        fi
    done
done
