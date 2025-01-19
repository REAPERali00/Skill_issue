import { useState } from "react";
import { useFindFirst, useAction, useUser } from "@gadgetinc/react";
import { getSkillsArray } from "../utils/skillHelpers";
import { api } from "../api";
import RadarChart from './radar-chart';
import ProgressBar from './level-bar';
import "./stat.css";

export default function () {
  const [{ data: userStat, fetching, error }] = useFindFirst(api.userStat);
  const user = useUser();
  const [{ creating }, createStat] = useAction(api.userStat.create);

  const [skillOne, setSkillOne] = useState("");
  const [skillTwo, setSkillTwo] = useState("");
  const [skillThree, setSkillThree] = useState("");
  const [skillFour, setSkillFour] = useState("");
  const [skillFive, setSkillFive] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createStat({
      level: 1,
      skillOne,
      skillOneValue: 0,
      skillTwo,
      skillTwoValue: 0,
      skillThree,
      skillThreeValue: 0,
      skillFour,
      skillFourValue: 0,
      skillFive,
      skillFiveValue: 0,
      user: {
        _link: user.id,
      },
    });
  };

  if (fetching) return <div>Loading stats...</div>;
  if (error) return <div>Error loading stats:{error.message}</div>;
  if (creating) return <div>Creating stats...</div>;


  const currentLevel = userStat ? Math.floor(
    (userStat.skillOneValue + userStat.skillTwoValue + 
     userStat.skillThreeValue + userStat.skillFourValue + 
     userStat.skillFiveValue) / (500)
  ) : 0

  const pointsNeeded = userStat ? (currentLevel+1) - (
    (userStat.skillOneValue + userStat.skillTwoValue + 
     userStat.skillThreeValue + userStat.skillFourValue + 
     userStat.skillFiveValue) / (500)
  ) : 0

  
  const levels = [
    { currentLevel: currentLevel, maxLevel: 10, color: '#4caf50' }, // Green for first bar
  ]; 
 
  return userStat ? (
    <>
      <div className="stat-display">
         <div className="stat-column">
            <h2>Level: {currentLevel}</h2>
           <p>XP needed for next level: {pointsNeeded.toFixed(3)}</p>
              {levels.map((level, index) => (
                <ProgressBar
                  key={index}
                  currentLevel={level.currentLevel}
                  maxLevel={level.maxLevel}
                  color={level.color}
                />
              ))}
           
            {getSkillsArray(userStat).map((skill) => (
              <p key={skill.name}>
                <b>{skill.name}:</b> Level {Math.floor(skill.value/100)}
              </p>
            ))}
          </div>
         <div className="stat-column">
            <RadarChart userStat={userStat} />
          </div>
       </div>
    </>
  ) : (
    <form onSubmit={handleSubmit}>
      <div className="mainContainer">
        <h2 className="titleText">Create Your Skill Profile</h2>
        <p className="helperMessage">
          Set up your initial skill profile by naming your top 5 skills. All skills start at level 0 
          and can be improved as you progress. Choose skills that best represent your expertise.
        </p>
        <div>
          <label className="skillText">
            Skill 1{" "}
          </label>
          <input className="inputField"
            type="text"
            value={skillOne}
            onChange={(e) => setSkillOne(e.target.value)}
            placeholder="e.g. Running"
            required
          />
        </div>
        <div>
          <label className="skillText">
            Skill 2{" "}
          </label>
          <input className="inputField"
            type="text"
            value={skillTwo}
            onChange={(e) => setSkillTwo(e.target.value)}
            placeholder="e.g. React Development"
            required
          />
        </div>
        <div>
          <label className="skillText">
            Skill 3{" "}
          </label>
          <input className="inputField"
            type="text"
            value={skillThree}
            onChange={(e) => setSkillThree(e.target.value)}
            placeholder="e.g. Dancing"
            required
          />
        </div>
        <div>
          <label className="skillText">
            Skill 4{" "}
          </label>
          <input className="inputField"
            type="text"
            value={skillFour}
            onChange={(e) => setSkillFour(e.target.value)}
            placeholder="e.g. UI/UX Design"
            required
          />
        </div>
        <div>
          <label className="skillText">
            Skill 5{" "}
          </label>
          <input className="inputField"
            type="text"
            value={skillFive}
            onChange={(e) => setSkillFive(e.target.value)}
            placeholder="e.g. Project Management"
            required
          />
        </div>
        <button className="createButton" type="submit">
          <div className="createText">Create</div>
        </button>
      </div>
    </form>
  );
}
  
