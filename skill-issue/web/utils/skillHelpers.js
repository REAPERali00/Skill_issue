/**
 * Takes a userStat record and returns an array of skill objects
 * @param {Object} userStat - The user stat record containing skills and their values
 * @returns {Array} Array of objects with name and value properties
 * 
 * @example
 *
 * @example
 * const skills = getSkillsArray(userStat);
 * skills.forEach(skill => console.log(`${skill.name}: ${skill.value}`));
 */
export const getSkillsArray = (userStat) => {
  return [
    { name: userStat.skillOne, value: userStat.skillOneValue },
    { name: userStat.skillTwo, value: userStat.skillTwoValue },
    { name: userStat.skillThree, value: userStat.skillThreeValue },
    { name: userStat.skillFour, value: userStat.skillFourValue },
    { name: userStat.skillFive, value: userStat.skillFiveValue }
  ];
};
