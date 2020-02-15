export default {
    bmrMetrics: [
        {// male
            paramWeight: 13.7,
            paramHeight: 5,
            paramAge: 6.8,
            paramBase: 66
        },
        {// female
            paramWeight: 9.6,
            paramHeight: 1.8,
            paramAge: 4.7,
            paramBase: 655
        }
    ],
    activityLevel: [1.2, 1.375, 1.55, 1.725, 1.9],
    proteinFFMITable: [
        [
            [ // FFMI 17~20
                { //bf < 16
                    bulk: 2.3,
                    cut: 2.6
                },
                { // 16 <= bf < 19
                    bulk: 2.2,
                    cut: 2.5
                },
                { // 19 <= bf <23
                    bulk: 2.1,
                    cut: 2.4
                }
            ],
            [ // FFMI 20~21
                { //bf < 15
                    bulk: 2.5,
                    cut: 2.8
                },
                { // 15 <= bf < 21
                    bulk: 2.4,
                    cut: 2.7
                }
            ],
            [ // FFMI 22~23
                { //bf < 15
                    bulk: 2.6,
                    cut: 2.9
                },
                { // 15 <= bf < 21
                    bulk: 2.5,
                    cut: 2.8
                }
            ],
            [ // FFMI > 23
                { //bf < 12
                    bulk: 2.6,
                    cut: 2.9
                },
                { // 12 <= bf < 16
                    bulk: 2.2,
                    cut: 2.8
                }
            ]
        ],
        [
            [ // FFMI 13~15
                { //bf < 19
                    bulk: 2.4,
                    cut: 2.7
                },
                { // 19 <= bf < 23
                    bulk: 2.3,
                    cut: 2.6
                },
                { // 23 <= bf < 27
                    bulk: 2.2,
                    cut: 2.5
                },
                { // 27 <= bf < 31
                    bulk: 2.2,
                    cut: 2.5
                }
            ],
            [ // FFMI 16~17
                { //bf < 19
                    bulk: 2.5,
                    cut: 2.8
                },
                { //19 <= bf < 25
                    bulk: 2.4,
                    cut: 2.7
                },
                { // 25 <= bf < 28
                    bulk: 2.3,
                    cut: 2.6
                }
            ],
            [ // FFMI 17-19
                { //bf < 18
                    bulk: 2.6,
                    cut: 2.9
                },
                { // 18 <= bf < 23
                    bulk: 2.5,
                    cut: 2.8
                }
            ]
        ]
    ],
    calculateBMI: function (height, weight) {
        return (weight / (height * height)).toFixed(2)
    },
    getBmiClass: function (bmi) {
        if (bmi <= 18.5) return '過輕';
        if (bmi > 18.5 && bmi < 25) return '普通';
        if (bmi >= 25 && bmi < 30) return '死胖子😢'; // 過重
        if (bmi >= 30) return '肥胖';
    },
    getBMR: function (gender, height, weight, age, activityLevel) {
        let base, metrics;
        if (gender === 'male') {
            metrics = this.bmrMetrics[0]
            base = metrics.paramBase +
                height * metrics.paramHeight +
                weight * metrics.paramWeight -
                age * metrics.paramAge
        } else {
            metrics = this.bmrMetrics[1]
            base = metrics.paramBase +
                height * metrics.paramHeight +
                weight * metrics.paramWeight -
                age * metrics.paramAge
        }
        base = base.toFixed(2)
        let tdee = (base * this.activityLevel[parseInt(activityLevel)]).toFixed(2)

        return [base, tdee]
    },
    getFFMI: function (height, weight, bodyfat) {
        let lean = weight * (100 - bodyfat) / 100;
        let ffmi = parseFloat(((lean / 2.2) / Math.pow(height / 100, 2) * 2.20462).toFixed(2))
        let adjustedFfmi = ffmi + (6.1 * (1.8 - height / 100))
        adjustedFfmi = adjustedFfmi.toFixed(2)
        return [ffmi, adjustedFfmi]
    },
    getProtein: function (gender, weight, bodyfat, ffmi) {
        let lean = weight * (100 - bodyfat) / 100;
        let pfMetrics = gender === 'male' ? this.proteinFFMITable[0] : this.proteinFFMITable[1]
        let bulk, cut, bulkProtein, cutProtein;
        // console.log(lean)
        if (gender === 'male') {
            switch (true) {
                case (ffmi <= 20):
                    // console.log(1)
                    if (bodyfat < 16) [bulk, cut] = [pfMetrics[0][0]['bulk'], pfMetrics[0][0]['cut']]
                    if (bodyfat >= 16 && bodyfat < 19) [bulk, cut] = [pfMetrics[0][1]['bulk'], pfMetrics[0][1]['cut']]
                    if (bodyfat >= 19) [bulk, cut] = [pfMetrics[0][2]['bulk'], pfMetrics[0][2]['cut']]
                    break;
                case (ffmi > 20 && ffmi <= 22):
                    // console.log(2)
                    if (bodyfat < 15) [bulk, cut] = [pfMetrics[1][0]['bulk'], pfMetrics[1][0]['cut']]
                    if (bodyfat >= 15) [bulk, cut] = [pfMetrics[1][1]['bulk'], pfMetrics[1][1]['cut']]
                    break;
                case (ffmi > 22 && ffmi <= 23):
                    // console.log(3)
                    if (bodyfat < 14) [bulk, cut] = [pfMetrics[2][0]['bulk'], pfMetrics[2][0]['cut']]
                    if (bodyfat >= 14) [bulk, cut] = [pfMetrics[2][1]['bulk'], pfMetrics[2][1]['cut']]
                    break;
                case (ffmi > 23):
                    // console.log(4)
                    if (bodyfat < 12) [bulk, cut] = [pfMetrics[3][0]['bulk'], pfMetrics[3][0]['cut']]
                    if (bodyfat >= 12) [bulk, cut] = [pfMetrics[3][1]['bulk'], pfMetrics[3][1]['cut']]
                    break;
                default:
                    bulk = 2.4;
                    cut = 2.7
            }
        } else {
            switch (true) {
                case (ffmi <= 15):
                    // console.log(1)
                    if (bodyfat < 19) [bulk, cut] = [pfMetrics[0][0]['bulk'], pfMetrics[0][0]['cut']]
                    if (bodyfat >= 19 && bodyfat < 23) [bulk, cut] = [pfMetrics[0][1]['bulk'], pfMetrics[0][1]['cut']]
                    if (bodyfat >= 23 && bodyfat < 27) [bulk, cut] = [pfMetrics[0][2]['bulk'], pfMetrics[0][2]['cut']]
                    if (bodyfat >= 27) [bulk, cut] = [pfMetrics[0][3]['bulk'], pfMetrics[0][3]['cut']]
                    break;
                case (ffmi > 15 && ffmi <= 17):
                    // console.log(2)
                    if (bodyfat < 18) [bulk, cut] = [pfMetrics[1][0]['bulk'], pfMetrics[1][0]['cut']]
                    if (bodyfat >= 18 && bodyfat < 25) [bulk, cut] = [pfMetrics[1][1]['bulk'], pfMetrics[1][1]['cut']]
                    if (bodyfat >= 25) [bulk, cut] = [pfMetrics[1][2]['bulk'], pfMetrics[1][2]['cut']]
                    break;
                case (ffmi > 17):
                    // console.log(3)
                    if (bodyfat < 18) [bulk, cut] = [pfMetrics[2][0]['bulk'], pfMetrics[2][0]['cut']]
                    if (bodyfat >= 18) [bulk, cut] = [pfMetrics[2][1]['bulk'], pfMetrics[2][1]['cut']]
                    break;
                default:
                    bulk = 2.4;
                    cut = 2.7;
            }
        }

        [bulkProtein, cutProtein] = [parseFloat((lean * bulk).toFixed(2)), parseFloat((lean * cut).toFixed(2))]

        return [bulkProtein, cutProtein]
    },
    getRemainFat: (targetCal, protein, carbs) => {
        let res = ((targetCal - (parseFloat(protein) + parseFloat(carbs)) * 4) / 9).toFixed(2)
        return res
    },
    getRemainCarbs: (type, targetCal, protein, weight) => {
        let fatParam;
        if(type === 'bulk'){
            // 高碳日比例：蛋白質 ( 如上表 )、脂肪 ( 體重 * 0.6~1.1g )、碳水 ( 剩下的熱量 )
            fatParam = 0.85;
        }else if (type === 'cut'){
            // 高碳日比例：蛋白質 ( 如上表 )、脂肪 ( 體重 * 0.6~1.4g )、碳水 ( 剩下的熱量 )
            fatParam = 1;
        }
        return ((targetCal - (parseFloat(protein)*4 + weight*fatParam*9) )/4).toFixed(2);
    }
}