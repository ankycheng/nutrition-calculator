import React from 'react';
// import logo from './logo.svg';
import './App.scss';
import BMI from './Components/BMI'
import utils from './utils'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bodyData: {
        weight: '79',
        height: '175',
        age: '29',
        gender: 'male',
        activityLevel: '2',
        bodyfat: 16
      },
      nutritionTarget: {
        mid: {
          proteinBulk: 0,
          proteinCut: 0,
          carbsBulk: 0,
          carbsCut: 0,
          fatBulk: 0,
          fatCut: 0
        },
        high: {
          proteinBulk: 0,
          proteinCut: 0,
          carbsBulk: 0,
          carbsCut: 0,
          fatBulk: 0,
          fatCut: 0
        },
        low: {
          proteinBulk: 0,
          proteinCut: 0,
          carbsBulk: 0,
          carbsCut: 0,
          fatBulk: 0,
          fatCut: 0
        },
      },
      bmi: 0,
      bmiClass: '',
      bmr: 0,
      tdee: 0,
      intakePercentage: 80,
      ffmi: 0,
      adjustedFfmi: 0
    }

    // need to bind before use "this" in methods
    this.handleHightChange = this.handleHightChange.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleAgeChange = this.handleAgeChange.bind(this);
    this.handleActivityChange = this.handleActivityChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
  }

  componentDidMount() {
    this.updateBMI()
    this.updateFFMI()
    this.updateBMR()
    this.updateNutritionLevelMid()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.bodyData !== this.state.bodyData) {
      this.updateBMI()
      this.updateFFMI()
      this.updateBMR()
      this.updateNutritionLevelMid()
    }
  }

  handleHightChange(event) {
    this.setState({
      bodyData: {
        ...this.state.bodyData,
        height: event.target.value
      }
    })
  }
  handleWeightChange(event) {
    this.setState({
      bodyData: {
        ...this.state.bodyData,
        weight: event.target.value
      }
    })
  }
  handleAgeChange(event) {
    this.setState({
      bodyData: {
        ...this.state.bodyData,
        age: event.target.value
      }
    })
  }
  handleActivityChange(event) {
    this.setState({
      bodyData: {
        ...this.state.bodyData,
        activityLevel: event.target.value
      }
    })
  }
  handleGenderChange(event) {
    this.setState({
      bodyData: {
        ...this.state.bodyData,
        gender: event.target.value
      }
    })
  }
  updateBMI = () => {
    let height = (this.state.bodyData.height / 100).toFixed(2);
    let weight = this.state.bodyData.weight;
    let bmi = utils.calculateBMI(height, weight)
    let bmiClass = utils.getBmiClass(bmi)

    this.setState((prevState) => ({
      ...prevState,
      bmi: bmi,
      bmiClass: bmiClass
    }))
  }
  updateFFMI = () => {
    let [ffmi, adjustedFfmi] = utils.getFFMI(
      this.state.bodyData.height,
      this.state.bodyData.weight,
      this.state.bodyData.bodyfat
    )
    this.setState((prevState) => ({
      ...prevState,
      ffmi: ffmi,
      adjustedFfmi: adjustedFfmi
    }))
  }
  updateBMR = () => {
    let [bmr, tdee] = utils.getBMR(
      this.state.bodyData.gender,
      this.state.bodyData.height,
      this.state.bodyData.weight,
      this.state.bodyData.age,
      this.state.bodyData.activityLevel,
    );
    this.setState((prevState) => ({
      ...prevState,
      bmr: bmr,
      tdee: tdee
    }))
  }

  updateNutritionLevelMid = () => {
    let [bulkProtein, cutProtein] = utils.getProtein(
      this.state.bodyData.gender,
      this.state.bodyData.weight,
      this.state.bodyData.bodyfat,
      this.state.ffmi,
    )

    this.setState((prevState) => {
      let targetCal = ((prevState.intakePercentage / 100) * prevState.tdee);
      // mid part
      let carbsIntakeMid = prevState.bodyData.weight * 2.2 * 1.25;
      let fatBulkMid = utils.getRemainFat(targetCal, bulkProtein, carbsIntakeMid);
      let fatCutMid = utils.getRemainFat(targetCal, cutProtein, carbsIntakeMid);

      // high
      let fatBulkHigh = (fatBulkMid * 0.85).toFixed(2);
      let fatCutHigh = fatCutMid * 1;
      let carbsBulkHigh = utils.getRemainCarbs('bulk', targetCal, bulkProtein, this.state.bodyData.weight);
      let carbsCutHigh = utils.getRemainCarbs('cut', targetCal, cutProtein, this.state.bodyData.weight);

      // low
      let carbsBulkLow = carbsIntakeMid > 50 ? 50 : carbsIntakeMid;
      let carbsCutLow = carbsIntakeMid > 50 ? 50 : carbsIntakeMid;
      let fatBulkLow = utils.getRemainFat(targetCal, bulkProtein, carbsBulkHigh);
      let fatCutLow = utils.getRemainFat(targetCal, cutProtein, carbsCutHigh);

      return {
        nutritionTarget: {
          ...prevState.nutritionTarget,           // copy all other key-value pairs of food object
          mid: {                     // specific object of food object
            ...prevState.nutritionTarget,   // copy all pizza key-value pairs
            proteinBulk: bulkProtein,          // update value of specific key
            proteinCut: cutProtein,
            carbsCut: carbsIntakeMid,
            carbsBulk: carbsIntakeMid,
            fatBulk: fatBulkMid,
            fatCut: fatCutMid,
          },
          high: {
            ...prevState.nutritionTarget,
            proteinBulk: bulkProtein,
            proteinCut: cutProtein,
            carbsCut: carbsCutHigh,
            carbsBulk: carbsBulkHigh,
            fatBulk: fatBulkHigh,
            fatCut: fatCutHigh,
          },
          low: {
            ...prevState.nutritionTarget,
            proteinBulk: bulkProtein,
            proteinCut: cutProtein,
            carbsCut: carbsCutLow,
            carbsBulk: carbsBulkLow,
            fatBulk: fatBulkLow,
            fatCut: fatCutLow,
          },

        }
      }
    })


  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Simple Nurition Calculator</h2>
        </div>
        <div className="App-body">
          <form className="form-wrapper">
            <h3>計算一些東西</h3>
            <label className="form-input">
              <div className="input-title">
                height:
              </div>
              <input
                type="number"
                value={this.state.bodyData.height}
                placeholder="input height"
                onChange={this.handleHightChange}
              />
              <div className="input-unit">cm</div>
            </label>
            <label className="form-input" htmlFor="input-weight">
              <div className="input-title">
                weight:
              </div>
              <input
                id="input-weight"
                type="number"
                value={this.state.bodyData.weight}
                placeholder="input weight"
                onChange={this.handleWeightChange}
              />
              <div className="input-unit">kg</div>
            </label>
            <label className="form-input" htmlFor="input-age">
              <div className="input-title">
                age:
              </div>
              <input
                id="input-age"
                type="number"
                value={this.state.bodyData.age}
                placeholder="input age"
                onChange={this.handleAgeChange}
              />
              <div className="input-unit">ages</div>
            </label>
            <label className="form-input" htmlFor="input-bodyfat">
              <div className="input-title">
                bodyfat:
              </div>
              <input
                id="input-bodyfat"
                type="number"
                value={this.state.bodyData.bodyfat}
                placeholder="input bodyfat"
                onChange={(event) => {
                  this.setState({
                    bodyData: {
                      ...this.state.bodyData,
                      bodyfat: event.target.value
                    }
                  })
                }}
              />
              <div className="input-unit">%</div>
            </label>
            <div className="form-input input-gender">
              <div className="input-title">性別：</div>
              <label>
                <div className="input-unit">男</div>
                <input type="radio" name="gender" value='male'
                  checked={this.state.bodyData.gender === 'male'}
                  onChange={this.handleGenderChange}
                />
              </label>
              <label>
                <div className="input-unit">女</div>
                <input type="radio" name="gender" value="female"
                  checked={this.state.bodyData.gender === 'female'}
                  onChange={this.handleGenderChange}
                />
              </label>
            </div>
            <label>
              <div className="input-title">
                你的運動頻率（次/週）：
              </div>
              <br />
              <select value={this.state.bodyData.activityLevel} onChange={this.handleActivityChange}>
                <option value="0">久坐（幾乎沒有運動）</option>
                <option value="1">輕度（1-3次）</option>
                <option value="2">中度（3-5次）</option>
                <option value="3">高度（5-7次）</option>
                <option value="4">極高（勞力工作者或是運動員）</option>
              </select>
            </label>
          </form>
          <div className="results">
            <h3>基本數值</h3>
            <BMI value={this.state}></BMI>
            <div className="result-tdee">
              BMR(Basal Metabolic Rate): {this.state.bmr}
              <br />
              TDEE(Total Daily Energy Expenditure): {this.state.tdee}
            </div>
            <hr />
            <div className="result-intake">
              <h3>計算碳循環營養</h3>
              <label htmlFor="input-intake-percentage">
                增/減重速度：
                <input
                  id="input-intake-percentage"
                  type="number"
                  placeholder="增減體重的速度"
                  value={this.state.intakePercentage}
                  onChange={(event) => {
                    this.setState({ intakePercentage: event.target.value });
                    this.updateNutritionLevelMid();
                  }}
                /> %
              </label>
              <br />
              => 每日攝取熱量：{(this.state.tdee * (this.state.intakePercentage / 100)).toFixed(2)}
              <br />
              FFMI: {this.state.ffmi} &nbsp;
              Adjusted FFMI: {this.state.adjustedFfmi}
              <br />
              <table >
                <thead>
                  <tr>
                    <th colSpan="4">增肌期</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td>Protein</td>
                    <td>Carbs</td>
                    <td>Fat</td>
                  </tr>
                  <tr>
                    <td>中碳日</td>
                    <td>{this.state.nutritionTarget.mid.proteinBulk}</td>
                    <td>{this.state.nutritionTarget.mid.carbsBulk}</td>
                    <td>{this.state.nutritionTarget.mid.fatBulk}</td>
                  </tr>
                  <tr>
                    <td>高碳日</td>
                    <td>{this.state.nutritionTarget.high.proteinBulk}</td>
                    <td>{this.state.nutritionTarget.high.carbsBulk}</td>
                    <td>{this.state.nutritionTarget.high.fatBulk}</td>
                  </tr>
                  <tr>
                    <td>低碳日</td>
                    <td>{this.state.nutritionTarget.low.proteinBulk}</td>
                    <td>{this.state.nutritionTarget.low.carbsBulk}</td>
                    <td>{this.state.nutritionTarget.low.fatBulk}</td>
                  </tr>
                </tbody>
                <thead>
                  <tr>
                    <th colSpan="4">減脂期</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td>Protein</td>
                    <td>Carbs</td>
                    <td>Fat</td>
                  </tr>
                  <tr>
                    <td>中碳日</td>
                    <td>{this.state.nutritionTarget.mid.proteinCut}</td>
                    <td>{this.state.nutritionTarget.mid.carbsCut}</td>
                    <td>{this.state.nutritionTarget.mid.fatCut}</td>
                  </tr>
                  <tr>
                    <td>高碳日</td>
                    <td>{this.state.nutritionTarget.high.proteinCut}</td>
                    <td>{this.state.nutritionTarget.high.carbsCut}</td>
                    <td>{this.state.nutritionTarget.high.fatCut}</td>
                  </tr>
                  <tr>
                    <td>低碳日</td>
                    <td>{this.state.nutritionTarget.low.proteinCut}</td>
                    <td>{this.state.nutritionTarget.low.carbsCut}</td>
                    <td>{this.state.nutritionTarget.low.fatCut}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
