import { useUser, useSignOut } from "@gadgetinc/react";
import { api } from "../api";
 

export default function () {
  const user = useUser(api);
  const signOut = useSignOut();

  return user ? (
    <div class="holdingBox">
      <div class="row1">
        <div class="col1">
            <p class="colText">colText1</p>
        </div>
        <div class="col2">
            <p class="colText">colText2</p>
        </div>
        <div class="col3">
            <p class="colText">colText3</p>
        </div>
      </div>

      <div class="row2">
        <p class="colText">hexagon</p>
      </div>
    </div>
  ) : null;
}
