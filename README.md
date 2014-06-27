angular-d3-charts
=================

D3 snippets wrapped for use with AngularJS


## Usage

### Donut Progress Chart

Template:

    <div donut-progress="sample"></div>


Init:

    $scope.sample = { 
      data: some_value,
      max: some_max,
      showPercentage: false,
      arcWidth: 20,
      transition: '',
      duration: 500,
      newChart: true
    };
