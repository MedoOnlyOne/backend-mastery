export default ({ num, iterations }) => {
    let result = 0;
    for (let i = 0; i < iterations; i++) {
        result += num;
    }
    return result;
};