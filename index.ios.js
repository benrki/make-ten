import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  Picker,
} from 'react-native';

OPERATORS = ['*', '/', '+', '-'];

let getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

let curry = function(func) {
  var parameters = Array.prototype.slice.call(arguments, 1);
  return function() {
    return func.apply(this, parameters.concat(
      Array.prototype.slice.call(arguments, 0)
    ));
  };
};

class makeTen extends Component {
  generateNumbers() {
    var numbers = [];
    for (var i = 0; i < this.numLength; i++) {
      numbers.push(getRandomInt(1, 10));
    }
    return numbers;
  }

  constructor(props) {
    super(props);
    this.numLength = 3;
    this.state = {
      number: 'Ten',
      numbers: this.generateNumbers(),
      operators: ['*', '*', '*']
    };
  }

  setOperator(i, op) {
    var operators = this.state.operators;
    operators[i] = op;
    this.setState({ operators });
  }

  renderInputs({ numbers, operators }) {
    let inputs = [];
    let setOperator = this.setOperator.bind(this);

    numbers.forEach(function(n, i) {
      var isLastElement = i >= (numbers.length - 1);

      inputs.push(
        <Text key={`numbers-${i}`} style={styles.number}>
          {n.toString()}
        </Text>
      );

      if (!isLastElement) {
        inputs.push(
          <Picker
            key={`input-${i}`}
            style={styles.picker}
            selectedValue={operators[i]}
            onValueChange={curry(setOperator, i)}
          >
            {OPERATORS.map((op) => (
              <Picker.Item
                style={styles.input}
                key={`input-${i}-${op}`}
                label={op}
                value={op}
              />
              )
            )}
          </Picker>
        );
      }
    });

    return inputs;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Make {this.state.number}
        </Text>
        <View style={styles.game}>
          {this.renderInputs(this.state)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    alignItems: 'center'
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold'
  },
  game: {
    flexDirection: 'row'
  },
  picker: {
    height: 50,
    width: 50,
    justifyContent: 'center'
  },
  number: {
    height: 50,
    width: 100,
    fontSize: 25,
    textAlign: 'center',
    margin: 10
  }
});

AppRegistry.registerComponent('makeTen', () => makeTen);
