mydir=$(dirname "$0")
echo $mydir
cd $mydir
git pull
wget -N https://epistat.sciensano.be/Data/COVID19BE_CASES_MUNI.json
git add COVID19BE_CASES_MUNI.json
git commit -m "update at $(date --iso-8601=minute)"
git push

