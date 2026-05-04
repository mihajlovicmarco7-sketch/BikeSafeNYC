import { theftReports } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';
import validation from '../helpers.js'

const exportedMethods = {
async createReport(
    userId,
    locationId,
    locationName,
    incidentDate,
    bikeDescription,
    contactEmail,
    contactPhone,
    notes) {
  
  userId = validation.checkId(userId);
  locationId = validation.checkId(locationId);
  locationName = validation.checkString(locationName, 'locationName');
  incidentDate = validation.checkIncidentDate(incidentDate);
  
  bikeDescription = validation.checkString(bikeDescription, 'bikeDescription');
  if (bikeDescription.length > 500) {
    bikeDescription = bikeDescription.substring(0, 500);
  }
  
  contactEmail = validation.checkEmail(contactEmail, 'contactEmail');
  contactPhone = validation.checkString(contactPhone, 'contactPhone');
  
  notes = validation.checkNotes(notes);
  if (notes.length > 500) {
    notes = notes.substring(0, 500);
  }

  let newReport = {
    userId: new ObjectId(userId),
    locationId: new ObjectId(locationId),
    locationName: locationName,
    incidentDate: new Date(incidentDate.replace(/-/g, '/')),
    bikeDescription: bikeDescription,
    contactEmail: contactEmail,
    contactPhone: contactPhone,
    notes: notes,
    status: 'missing',
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: []
  };

  const theftReportsCollection = await theftReports();
  const insertInfo = await theftReportsCollection.insertOne(newReport);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not add report';

  const newId = insertInfo.insertedId.toString();
  const data = await this.getTheftReportsById(newId);
  
  return data;
},

async updateReport(
    id,  
    bikeDescription,
    incidentDate,
    contactEmail,
    contactPhone,
    notes,
    status) {

  id = validation.checkId(id); 
  
  bikeDescription = validation.checkString(bikeDescription, 'bikeDescription');
  if (bikeDescription.length > 500) {
    bikeDescription = bikeDescription.substring(0, 500);
  }
  
  incidentDate = validation.checkIncidentDate(incidentDate);
  contactEmail = validation.checkEmail(contactEmail, 'contactEmail');
  contactPhone = validation.checkString(contactPhone, 'contactPhone');
  
  notes = validation.checkNotes(notes);
  if (notes.length > 500) {
    notes = notes.substring(0, 500);
  }
  status = validation.checkStatus(status);

  const theftReportsCollection = await theftReports();

  const updateInfo = await theftReportsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { 
      bikeDescription: bikeDescription,
      incidentDate: new Date(incidentDate),       
      contactEmail: contactEmail,
      contactPhone: contactPhone,
      notes: notes,
      status: status,
      updatedAt: new Date()  }
    }
  );

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
    throw new Error(`Could not update report with id of ${id}`);
  }

  const updatedReport = await theftReportsCollection.findOne({ _id: new ObjectId(id) });
  
  updatedReport._id = updatedReport._id.toString();
  updatedReport.userId = updatedReport.userId.toString();
  updatedReport.locationId = updatedReport.locationId.toString();

  updatedReport.comments.forEach(comment => {
    comment._id = comment._id.toString();
    comment.userId = comment.userId.toString();
  });
  
  return updatedReport;
},

async getAllTheftReports(){
  const theftReportsCollection = await theftReports();
  const data = await theftReportsCollection.find({}).toArray();

  data.forEach(elem => {
    elem._id = elem._id.toString();
    elem.userId = elem.userId.toString();
    elem.locationId = elem.locationId.toString();

    elem.comments.forEach(comment => {
      comment._id = comment._id.toString();
      comment.userId = comment.userId.toString();
    });
  });    

  return data;
},

async getTheftReportsById(id){
  id = validation.checkId(id);

  const theftReportsCollection = await theftReports();
  const data = await theftReportsCollection.findOne({_id: new ObjectId(id)});

  if (!data) throw `Theft report ${id} not found!`;

  data._id = data._id.toString();
  data.userId = data.userId.toString();
  data.locationId = data.locationId.toString();

  data.comments.forEach(comment => {
    comment._id = comment._id.toString();
    comment.userId = comment.userId.toString();
  });

  return data;
},

async getReportsByLocation(id){
  id = validation.checkId(id);

  const theftReportsCollection = await theftReports();
  const reports = await theftReportsCollection
    .find({ locationId: new ObjectId(id) })
    .toArray();
  
  reports.forEach(elem => {
    elem._id = elem._id.toString();
    elem.userId = elem.userId.toString();
    elem.locationId = elem.locationId.toString();

    elem.comments.forEach(comment => {
      comment._id = comment._id.toString();
      comment.userId = comment.userId.toString();
    });
  });

  return reports;    
},

async getMissingReports(){
  const theftReportsCollection = await theftReports();
  const missingReports = await theftReportsCollection.find({ status: 'missing' }).toArray();

  missingReports.forEach(elem => {
    elem._id = elem._id.toString();
    elem.userId = elem.userId.toString();
    elem.locationId = elem.locationId.toString();

    elem.comments.forEach(comment => {
      comment._id = comment._id.toString();
      comment.userId = comment.userId.toString();
    });
  });    
  
  return missingReports;
},

async updateReportStatus(id, newStatus){
  id = validation.checkId(id);
  newStatus = validation.checkStatus(newStatus);
  
  const theftReportsCollection = await theftReports();

  const updateInfo = await theftReportsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: newStatus } }
  );

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
    throw new Error(`Could not update report with id of ${id}`);
  }

  const updatedReport = await theftReportsCollection.findOne({ _id: new ObjectId(id) });
  
  updatedReport._id = updatedReport._id.toString();
  updatedReport.userId = updatedReport.userId.toString();
  updatedReport.locationId = updatedReport.locationId.toString();

  updatedReport.comments.forEach(comment => {
    comment._id = comment._id.toString();
    comment.userId = comment.userId.toString();
  });
  
  return updatedReport;
},

async deleteReport(id){
  id = validation.checkId(id);

  const theftReportsCollection = await theftReports();
  const data = await theftReportsCollection.findOneAndDelete({
    _id: new ObjectId(id)
  });

  if (!data) {
    throw `Could not delete report with ID of ${id}`;
  }

  return {id: id, deleted: true};

},

async getReportsByUser(userId){

  userId = validation.checkId(userId);

  const theftReportsCollection = await theftReports();

  const userReports = await theftReportsCollection
    .find({ userId: new ObjectId(userId) })
    .toArray();

  userReports.forEach(elem => {
    elem._id = elem._id.toString();
    elem.userId = elem.userId.toString();
    elem.locationId = elem.locationId.toString();

    elem.comments.forEach(comment => {
      comment._id = comment._id.toString();
      comment.userId = comment.userId.toString();
    });
  });    
  
  return userReports;
},

async addComment(
    id,
    userId,
    username,
    text) {

  id = validation.checkId(id); 
  userId = validation.checkId(userId); 
  username = validation.checkString(username, 'username');
  text = validation.checkString(text, 'comment');

  if (text.length > 500) {
    text = text.substring(0, 500);
  }

  const theftReportsCollection = await theftReports();
  
  let newComment = {
    _id: new ObjectId(),
    userId: new ObjectId(userId),
    username: username,
    text: text,
    createdAt: new Date()
  };
  
  const updateInfo = await theftReportsCollection.updateOne(
    {_id: new ObjectId(id)}, 
    {
      $push: {comments: newComment}
    }
  );
  
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
    throw new Error(`Could not update report with id of ${id}`);
  }

  return await this.getTheftReportsById(id);
  
},

};

export default exportedMethods;

