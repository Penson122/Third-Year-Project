import json

from optparse import OptionParser

parser = OptionParser()
parser.add_option("-f", "--file", dest="source",
                  help="read from FILE", metavar="FILE")
parser.add_option("-o", "--output-file", metavar="OUTPUT_FILE",
                  dest="outputFile", default="hadcrut4.json",
                  help="write to OUTPUT_FILE")
parser.add_option("-v", "--verbose", dest="verbose", default=False, help="Print to stdout", action="store_true")

(options, args) = parser.parse_args()

hadcrut4 = open(options.source, "r")
output = {}
output['name'] = 'hadcrut4'
hadcrutData = []
output['data'] = hadcrutData
for line in hadcrut4.readlines():
    currentMonth = {}
    data = line.split()
    yearMonth = data[0].split('/')
    year = int(yearMonth[0])
    month = int(yearMonth[1])
    currentMonth['month'] = month
    currentMonth['year'] = year
    currentMonth['mean'] = float(data[1])
    currentMonth['lowerBoundBias'] = float(data[2])
    currentMonth['upperBoundBias'] = float(data[3])
    currentMonth['lowerBoundMeasurement'] = float(data[4])
    currentMonth['upperBoundMeasurement'] = float(data[5])
    currentMonth['lowerBoundCoverage'] = float(data[6])
    currentMonth['upperBoundCoverage'] = float(data[7])
    currentMonth['lowerBoundCombination'] = float(data[8])
    currentMonth['upperBoundCombination'] = float(data[9])
    currentMonth['lowerBoundCombinedAll'] = float(data[10])
    currentMonth['upperBoundCombinedAll'] = float(data[11])
    hadcrutData.append(currentMonth)

with open(options.outputFile, 'w') as outfile:
    json.dump(output, outfile, indent=2)

if(options.verbose):
    print(json.dumps(output, indent=2))

hadcrut4.close()
