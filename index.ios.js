import React, {
  AppRegistry,
  Animated,
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  Picker,
} from 'react-native';

const NUMLENGTH = 4; // Default amount of numbers in a game
const OPERATORS = ['*', '/', '+', '-'];
const OPMAP = {
  '*': (n1, n2) => n1 * n2,
  '/': (n1, n2) => n1 / n2,
  '+': (n1, n2) => n1 + n2,
  '-': (n1, n2) => n1 - n2
}

const getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const curry = function(func) {
  var parameters = Array.prototype.slice.call(arguments, 1);
  return function() {
    return func.apply(this, parameters.concat(
      Array.prototype.slice.call(arguments, 0)
    ));
  };
};

const generateRandArray = function({ size, min, max }) {
  var res = [];
  for (var i = 0; i < size; i++) {
    res.push(getRandomInt(min, max));
  }
  return res;
}

class makeTen extends Component {
  animateTitle() {
    Animated.timing(this.state.title.opacity, {
      toValue: 1,
      duration: 3000
    }).start();
    Animated.timing(this.state.number.opacity, {
      toValue: 1,
      duration: 5000
    }).start();
  }

  componentDidMount() {
    this.animateTitle();
  }

  getRandomOperators(n) {
    return generateRandArray({ size: n, min: 0, max: 4 }).map(
      (n) => OPERATORS[n]
    );
  }

  doOperation({ operators, numbers }, index) {
    // Avoid mutating inputs
    numbers   = numbers.slice(0);
    operators = operators.slice(0);
    var n1    = numbers[index];
    var n2    = numbers[index + 1];
    var op    = operators.splice(index, 1)[0];

    numbers[index] = OPMAP[op](n1, n2);
    numbers.splice(index + 1, 1);

    return { numbers, operators };
  }

  evaluateCombination({ numbers, operators }) {
    var doOperation = curry(this.doOperation, { operators, numbers });

    if (numbers.length === 1) {
      // Base case
      return numbers[0];
    } else {
      var multOrDiv = operators.findIndex((op) => op === '*' || op === '/');
      var index = multOrDiv !== -1 ? multOrDiv : 0;

      return this.evaluateCombination.bind(this)(doOperation(index));
    }
  }

  generateNumbers(n) {
    return generateRandArray({ size: n, min: 1, max: 10 });
  }

  generateNewGame(numLength = NUMLENGTH) {
    var numbers   = this.generateNumbers(numLength);
    var operators = this.getRandomOperators(numLength - 1);
    var value     = this.evaluateCombination({ numbers, operators });

    if (Math.floor(value) !== value) {
      return this.generateNewGame.bind(this)(numLength);
    } else {
      console.info('generateNewGame', operators);
      return {
        title: {
          opacity: new Animated.Value(0)
        },
        number: {
          value,
          opacity: new Animated.Value(0)
        },
        numbers,
        operators: ['*', '*', '*'],
        win: {
          text: {
            opacity: new Animated.Value(0)
          },
          replay: {
            opacity: new Animated.Value(0)
          }
        }
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = this.generateNewGame();
  }

  animateWin() {
    Animated.timing(this.state.win.text.opacity, {
      toValue: 1,
      duration: 1000
    }).start();
    Animated.timing(this.state.win.replay.opacity, {
      toValue: 1,
      duration: 3000
    }).start();
  }

  // Set the current state operator at index i
  setOperator(i, op) {
    var operators = this.state.operators;
    operators[i] = op;

    this.setState({ operators });
    if (this.evaluateCombination(this.state) === this.state.number.value) {
       this.animateWin()
    }
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
            {OPERATORS.map((op) =>
              <Picker.Item
                style={styles.input}
                key={`input-${i}-${op}`}
                label={op}
                value={op}
              />
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
        <View style={styles.titleContainer}>
          <Animated.Text
            style={[{ opacity: this.state.title.opacity }, styles.title]}
          >
            Make
          </Animated.Text>
          <Animated.Text
            style={[{ opacity: this.state.number.opacity }, styles.title]}
          >
            {this.state.number.value}
          </Animated.Text>
        </View>
        <View style={styles.game}>
          {this.renderInputs(this.state)}
        </View>
        <View style={styles.winContainer}>
          <Animated.Text
            style={[{ opacity: this.state.win.text.opacity }, styles.win]}
          >
            A winner is you!
          </Animated.Text>
          <Animated.Text
            style={[{ opacity: this.state.win.replay.opacity }, styles.win]}
          >
            Tap to play again
          </Animated.Text>
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
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 100
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
    alignSelf: 'auto'
  },
  game: {
    flexDirection: 'row',
    marginBottom: 200
  },
  picker: {
    height: 50,
    width: 25,
    justifyContent: 'center',
    margin: 10
  },
  number: {
    height: 50,
    width: 25,
    fontSize: 25,
    textAlign: 'center',
    margin: 10
  }
});

AppRegistry.registerComponent('makeTen', () => makeTen);
