import csv
import json
import cli

(options, args) = cli.getOptions()

output = {}
output['name'] = options.name
gistempData = []
output['data'] = gistempData

with open(options.source, newline='') as csvfile:
    gistempFile = csv.reader(csvfile, delimiter=',')
    next(gistempFile, None)
    for row in gistempFile:
        gistempData.append({ 'year': int(row[0]), 'mean': float(row[13])});

if(options.outputFile):
    with open(options.outputFile, 'w') as outfile:
        json.dump(output, outfile)

if(options.verbose):
    print(json.dumps(output, indent=2))
