const isItYaml = (filename) => {
    return filename.split('.').pop() === 'yaml' ? true : false
}

module.exports = isItYaml
