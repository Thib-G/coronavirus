mydir=$(dirname "$0")
echo $mydir
cd $mydir
git pull
wget -N https://epistat.sciensano.be/Data/COVID19BE_CASES_MUNI.json -O COVID19BE_CASES_MUNI.json
wget -N https://epistat.sciensano.be/Data/COVID19BE_CASES_AGESEX.json -O COVID19BE_CASES_AGESEX.json
wget -N https://epistat.sciensano.be/Data/COVID19BE_CASES_MUNI_CUM.json -O COVID19BE_CASES_MUNI_CUM.json
wget -N https://epistat.sciensano.be/Data/COVID19BE_HOSP.json -O COVID19BE_HOSP.json
wget -N https://epistat.sciensano.be/Data/COVID19BE_MORT.json -O COVID19BE_MORT.json
wget -N https://epistat.sciensano.be/Data/COVID19BE_tests.json -O COVID19BE_tests.json
iconv -f "windows-1252" -t UTF-8 COVID19BE_CASES_MUNI.json -o COVID19BE_CASES_MUNI.utf8.json
iconv -f "windows-1252" -t UTF-8 COVID19BE_CASES_AGESEX.json -o COVID19BE_CASES_AGESEX.utf8.json
iconv -f "windows-1252" -t UTF-8 COVID19BE_CASES_MUNI_CUM.json -o COVID19BE_CASES_MUNI_CUM.utf8.json
iconv -f "windows-1252" -t UTF-8 COVID19BE_HOSP.json -o COVID19BE_HOSP.utf8.json
iconv -f "windows-1252" -t UTF-8 COVID19BE_MORT.json -o COVID19BE_MORT.utf8.json
iconv -f "windows-1252" -t UTF-8 COVID19BE_tests.json -o COVID19BE_tests.utf8.json
git add COVID19BE_CASES_MUNI.json
git add COVID19BE_CASES_AGESEX.json
git add COVID19BE_CASES_MUNI_CUM.json
git add COVID19BE_HOSP.json
git add COVID19BE_MORT.json
git add COVID19BE_tests.json
git add COVID19BE_CASES_MUNI.utf8.json
git add COVID19BE_CASES_AGESEX.utf8.json
git add COVID19BE_CASES_MUNI_CUM.utf8.json
git add COVID19BE_HOSP.utf8.json
git add COVID19BE_MORT.utf8.json
git add COVID19BE_tests.utf8.json
git commit -m "autoupdate at $(date --iso-8601=minute)"
git push

