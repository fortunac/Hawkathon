import json

locationData = open('dataset/locations.json')

locationJson = json.load(locationData)

result = {}
for entry in locationJson:
    fips = entry["County_Fips"]
    if fips in result:
        result[fips] += 1
    else:
        result[fips] = 1

print result
