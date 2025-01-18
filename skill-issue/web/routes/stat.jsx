import { useState } from "react";
import { useFindFirst, useAction, useUser } from "@gadgetinc/react";
import { getSkillsArray } from "../utils/skillHelpers";
import { api } from "../api";

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

  return userStat ? (
    <>
      <div>
        <div className="holdingBox">
          <h2>Level: {userStat.level}</h2>
          {getSkillsArray(userStat).map((skill) => (
            <p key={skill.name}>
              {skill.name}: {skill.value}
            </p>
          ))}
        </div>
  
        <div>
          Chart goes here:
        </div>

      </div>
      
    </>
  ) : (
    <form onSubmit={handleSubmit}>
      <h2>Create Your Skill Profile</h2>
      <p>
        Set up your initial skill profile by naming your top 5 skills. All skills start at level 0 
        and can be improved as you progress. Choose skills that best represent your expertise.
      </p>
      <div>
        <label>
          Name of Skill #1:{" "}
          <input
            type="text"
            value={skillOne}
            onChange={(e) => setSkillOne(e.target.value)}
            placeholder="e.g. JavaScript Programming"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Name of Skill #2:{" "}
          <input
            type="text"
            value={skillTwo}
            onChange={(e) => setSkillTwo(e.target.value)}
            placeholder="e.g. React Development"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Name of Skill #3:{" "}
          <input
            type="text"
            value={skillThree}
            onChange={(e) => setSkillThree(e.target.value)}
            placeholder="e.g. Database Management"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Name of Skill #4:{" "}
          <input
            type="text"
            value={skillFour}
            onChange={(e) => setSkillFour(e.target.value)}
            placeholder="e.g. UI/UX Design"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Name of Skill #5:{" "}
          <input
            type="text"
            value={skillFive}
            onChange={(e) => setSkillFive(e.target.value)}
            placeholder="e.g. Project Management"
            required
          />
        </label>
      </div>
      <button type="submit">Create Skill Profile</button>
    </form>
  );
}
