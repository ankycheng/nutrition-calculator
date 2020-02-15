import React from 'react'

class BMI extends React.Component {
  // constructor(props) {
  //   super(props)
  // }

  render() {
    return (
      <div className="result-bmi">
        <div>BMI: {this.props.value.bmi}（{this.props.value.bmiClass}）</div>
      </div>
    )
  }
}

export default BMI;