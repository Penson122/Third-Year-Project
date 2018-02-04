import json
import cli

(options, args) = cli.getOptions()

cowtan = open(options.source, "r")
output = {}
output['name'] = options.name
cowtanData = []
output['data'] = cowtanData
for line in cowtan.readlines():
    currentMonth = {}
    data = line.split()
    yearMonth = data[0].split('/')
    year = int(yearMonth[0])
    if(len(yearMonth) == 2):
        month = int(yearMonth[1])
        currentMonth['month'] = month
    currentMonth['year'] = year
    currentMonth['mean'] = float(data[1])
    currentMonth['totalUncertainty'] = float(data[2])
    currentMonth['coverageUncertainty'] = float(data[3])
    currentMonth['ensembleUncertainty'] = float(data[4])
    cowtanData.append(currentMonth)

if(options.outputFile):
    with open(options.outputFile, 'w') as outfile:
        json.dump(output, outfile)

if(options.verbose):
    print(json.dumps(output, indent=2))

cowtan.close()
