import { useFindFirst } from "@gadgetinc/react";
import { getSkillsArray } from "../utils/skillHelpers";
import { api } from "../api";

export default function () {
  const [{ data: userStat, fetching, error }] = useFindFirst(api.userStat);

  if (fetching) return <div>Loading stats...</div>;
  if (error) return <div>Error loading stats:{error.message}</div>;
  return userStat ? (
    <>
      <div>
        <h2>Level: {userStat.level}</h2>
        {getSkillsArray(userStat).map((skill) => (
          <p key={skill.name}>
            {skill.name}: {skill.value}
          </p>
        ))}
      </div>
    </>
  ) : (
    <div>No user stat found</div>
  );
}
