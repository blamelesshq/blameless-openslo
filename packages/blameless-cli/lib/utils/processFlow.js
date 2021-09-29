const parseYamlToJson = require('./parseYamlToJson')
const getAllSLIs = require('../../handlers/getAllSLIs')
const getAllSliTypes = require('../../handlers/getSliTypes')

const processFlow = async (input) => {
    const document = parseYamlToJson(input)
    const documentType = document?.kind
    const allSlis = await getAllSLIs('POST')
    const sliTypes = await getAllSliTypes('POST')

    const doesSliExist =
        allSlis &&
        allSlis.find((item) => item?.name === document?.metadata?.name)
    const resourceIdByName = doesSliExist?.sliTypeId

    const sliTypeId =
        sliTypes &&
        sliTypes.find(
            (item) => item?.name?.toLowerCase() === document?.spec?.sliType
        ).id

    console.log(sliTypeId)
}

module.exports = processFlow
