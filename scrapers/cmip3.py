import json
import re

cmip3 = open("sources/itas_cmip3_all_sresa1b_0-360E_-90-90N_n_++_mean1a.txt", "r")

cmipData = {}

ensembleRegex = r'ensemble member\s+'
datapointRegex = r'\d+\.\d+'
currentEnsemble = None

for line in cmip3.readlines():
  ensembleMatch = re.search(ensembleRegex, line, flags=0)
  datapointMatch = re.search(datapointRegex, line, flags=0)
  # get lines starting with ensemble members
  if(ensembleMatch):
    ensembleNumber = int(line[ensembleMatch.end():])
    currentEnsemble = {}
    cmipData[ensembleNumber] = currentEnsemble

  if(datapointMatch):
    datapoints = line.split()
    currentEnsemble[int(float(datapoints[0]))] = float(datapoints[1])

print(json.dumps(cmipData, indent=2))

cmip3.close()

# consume next two lines
# append to json structure
#
