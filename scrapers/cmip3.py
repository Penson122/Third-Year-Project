import json
import re
import cli

(options, args) = cli.getOptions()

cmip3 = open(options.source, "r")
cmipData = []
output = {
    "name": options.name,
    "data": cmipData
}
ensembleRegex = r'ensemble member\s+'
datapointRegex = r'\d+\.\d+'
currentEnsemble = None

for line in cmip3.readlines():
    ensembleMatch = re.search(ensembleRegex, line, flags=0)
    datapointMatch = re.search(datapointRegex, line, flags=0)
    # get lines starting with ensemble members
    if(ensembleMatch):
        currentEnsemble = int(line[ensembleMatch.end():])

    if(datapointMatch):
        datapoints = line.split()
        current = {
            "ensembleNumber": currentEnsemble,
            "year": int(float(datapoints[0])),
            "mean": float(datapoints[1])
        }
        cmipData.append(current)

formattedData = []
for item in cmipData:
    found = list(filter(lambda x: x['year'] == item['year'], formattedData))
    if(len(found) == 0):
        formattedData.append({
            "year": item['year'],
            "data": [{
                "ensembleNumber": item['ensembleNumber'], "mean": item['mean']
            }]
        })
    else:
        found[0]['data'].append({
            "ensembleNumber": item['ensembleNumber'], "mean": item['mean']
        })

output['data'] = formattedData

if(options.outputFile):
    with open(options.outputFile, 'w') as outfile:
        json.dump(output, outfile)

if(options.verbose):
    print(json.dumps(output, indent=2))

cmip3.close()
