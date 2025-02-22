import axios from "axios";
//const url = "http://ec2-13-58-174-58.us-east-2.compute.amazonaws.com/api/";
const url = "http://localhost:3000/api/logs/";

class PostService {
  ///////////////////////////////////////
  /////// L O G S ///////////////////////
  ///////////////////////////////////////

  //// Get Month
  static async getMonth(load) {
    try {
      const res = await axios.post(url + "getmonth/", { load });
      return res.data;
    } catch (err) {
      return err;
    }
  }

  //// Update Month Log
  static updateLog(load) {
    return axios.post(url + "update/", { load });
  }

  ///////////////////////////////////////
  /////// U S E R S /////////////////////
  ///////////////////////////////////////

  //// Create User
  static makeUser(user) {
    return axios.post(url + "makeuser", { user });
  }

  // Check user (to see if exists)
  static async checkUser(email) {
    try {
      const res = await axios.get(url + "checkuser/" + email);
      return res.status;
    } catch (err) {
      return err;
    }
  }

  // Validate user (returns full user data)
  static async validateUser(data) {
    const res = await axios.post(url + "validateuser/", data);
    try {
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Get user data by token id
  static async getUserData(data) {
    const res = await axios.post(url + "getuserdata/", data);
    try {
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Get user points
  static async getUserPoints(user) {
    const res = await axios.post(url + "getpoints/", { user });
    try {
      return res.data;
    } catch (err) {
      return err;
    }
  }

  ///////////////////////////////////////
  /////// I C O N S  ////////////////////
  ///////////////////////////////////////

  //// Get Icons (search)
  static async getIcons(term) {
    console.log("getting... " + term);
    const res = await axios.get(url + "icons/" + term);
    try {
      console.log("Success");
      console.log(res);
      return res;
    } catch (err) {
      console.log("Error");
      return err;
    }
  }
  //// Get Icon (single)
  static async getIcon(id) {
    console.log("getting ID... " + id);
    const res = await axios.get(url + "icon/" + id);
    try {
      console.log("Success");
      return res;
    } catch (err) {
      console.log("Error");
      return err;
    }
  }

  ///////////////////////////////////////
  /////// B A D G E S  //////////////////
  ///////////////////////////////////////

  //// Save Badge / Habit
  static saveBadge(load) {
    return axios.post(url + "savebadge/", { load });
  }

  ///////////////////////////////////////
  /////// R E W A R D S  ////////////////
  ///////////////////////////////////////

  //// Save Reward
  static saveReward(load) {
    return axios.post(url + "savereward/", { load });
  }

  //// Charge tab
  static chargeTab(load) {
    return axios.post(url + "updatetabs/", { load });
  }
}

export default PostService;
