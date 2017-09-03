import json

hadcrut4 = open("sources/HadCRUT.4.5.0.0.annual_ns_avg.txt", "r")

hadcrutData = {}

for line in hadcrut4.readlines():
  data = line.split()
  hadcrutData[data[0]] = data[1]

print(json.dumps(hadcrutData, indent=2))

hadcrut4.close()