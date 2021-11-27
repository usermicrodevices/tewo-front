export default (data) => data.replace(/(\d),(\d)/g, '$1.$2').split(',').map(parseFloat);
