import json
from states import stateAbbrev
from states import stateData

result = {}
totalScore = 0
count = 0

dischargeData = open('dataset/discharge.json')
infectionData = open('dataset/infection.json')
#string = data.read()
#json = json.loads(string.replace("Pricing_Amount_in_", ""))

dischargeJson = json.load(dischargeData)
infectionJson = json.load(infectionData)

def evaluateScore(score):
    global totalScore
    global count
    if score is None:
        return
    if score < 1:
        totalScore += 1
    elif score > 1:
        totalScore -= 1
    count += 1

for entry in dischargeJson:
    abbrev = stateAbbrev.get(entry["State_Name"])
    if abbrev:
        emergen = entry["Rate_Perc_Emergen_Rm_Visit_30_D"] if entry["Rate_Perc_Emergen_Rm_Visit_30_D"] else 0
        ambu = entry["Rate_Perc_Ambu_14_D"] if entry["Rate_Perc_Ambu_14_D"] else 0
        pcp = entry["Rate_Perc_Seeing_Pri_Care_14_D"] if entry["Rate_Perc_Seeing_Pri_Care_14_D"] else 0
        readmit = entry["Rate_Perc_Readmit_30_D"] if entry["Rate_Perc_Readmit_30_D"] else 0
        num = entry["Number_Of_Patients_In_Medical_Cohort"]
        stateData[abbrev] = {"pop": num, "ambu": ambu * 0.4, "readmit": readmit * 0.3, "emergen": emergen * 0.15, "pcp": pcp * 0.15}


for entry in infectionJson:
    state = entry["State"]
    measure = entry["Measure_ID"]
    if state not in stateData:
        continue
    if "SIR" not in measure:
        continue
    if state in result:
        result[state][measure] = entry["Score"]
    else:
        result[state] = {measure: entry["Score"]}

for state in result:
    totalScore = 0
    count = 0
    tmp = result[state]
    map(evaluateScore, tmp.values())
    if count:
        stateData[state]['SIR'] = totalScore

print stateData
