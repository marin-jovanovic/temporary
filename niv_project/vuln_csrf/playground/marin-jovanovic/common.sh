# collection of cqrs_c
# not intended to be run as a script

pip3 freeze > requirements.txt


# delete all non existing branches
git fetch -p && git branch -vv | awk '/: gone]/{print $1}' | xargs git branch -D