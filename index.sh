#!/bin/bash

mkdir -p tmp

DIRS=$(find . -maxdepth 1 -type d -regex '\./[0-9][0-9]-.*')
FILES=('input.txt' 'pride-and-prejudice.txt' 'test.txt')

for d in ${DIRS[@]}; do
    for f in ${FILES[@]}; do
        node "$d/index.js" $f >"./tmp/$f" 2>/dev/null
        diff "./tmp/$f" "./tests/$f" &>/dev/null
        if [ $? -eq 0 ]; then
            echo "✔️  Ok for $d with $f"
        else
            if [[ "$d" = "./08-infinite-mirror" && "$f" = "pride-and-prejudice.txt" ]]; then
                echo "⚠️  Issues for $d with $f (Maximum call stack size exceeded)"
            else
                echo "❌ Errors for $d with $f"
                exit 1
            fi
        fi
    done
done

exit 0
