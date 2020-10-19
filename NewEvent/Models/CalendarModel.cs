using NewEvent.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Npgsql;
using System.Web.Routing;
using System.Dynamic;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using NewEvent.Helpers;

namespace NewEvent.Models{
    public class CalendarModel{
        private DbTapics DB_Tapics;
        private DbCCS DB_CCS;


        private DataSet ds = new DataSet();
        private DataSet ds2 = new DataSet();
        private SqlDataAdapter da = new SqlDataAdapter();
        private SqlDataAdapter da2 = new SqlDataAdapter();
        private SqlConnection cn = new SqlConnection(ConfigurationManager.ConnectionStrings["CCS"].ConnectionString);
        private string date;
        private string date_ff;
        private object ForeignKey;
        public class Value
        {
            public List<string> value { get; set; }
        }

        public CalendarModel(){
            DB_Tapics = new DbTapics();
            DB_CCS = new DbCCS();
            date = DateTime.Now.ToString("yyyyMMddHHmmss");
            date_ff = DateTime.Now.ToString("yyyyMMddHHmmss.fff");
        }

        public List<string> GetLineByProduction(string Production){
            try{
                var sql = "";
                if(Production == "P3A" || Production == "P3M"){
                    sql = $"SELECT line FROM v_line_pro WHERE proddpt_trad='P3' and proddpt='{Production}' ORDER BY line ASC";
                }else{
                    sql = $"SELECT line FROM v_line_pro WHERE proddpt_trad='{Production}' ORDER BY line ASC";
                }
                var Lines = DB_Tapics.Database.SqlQuery<string>(sql).ToList();
                return Lines;
            }catch(Exception err){
                return null;
            }
        }

        public DataSet GetRequestDataSet(){
            return ds;
        }

        public void SetForeignKey(object ForeignKey){
            this.ForeignKey = ForeignKey;
        }

        public void DeleteFile(){
            string del = "DELETE FROM [File] WHERE ID_File like '%" + ForeignKey + "%' ";
            DB_CCS.Database.ExecuteSqlCommand(del);
        }

        public long InsertFile(HttpPostedFileBase file, long fk_id, string type, string description, object session_user, string topic_code, string dept){
            string query = $@"INSERT INTO [File] (FK_ID, [Type], Name, Size, Name_Format, Description, Time_Insert, User_Insert, Topic, Department) 
            OUTPUT Inserted.ID VALUES({fk_id}, '{type}', '{file.FileName.ToString().ReplaceSingleQuote()}','{file.ContentLength}','{date_ff}','{description}','{date}','{session_user}', '{topic_code}', '{dept}');";
            long result = DB_CCS.Database.SqlQuery<long>(query).First();
            return result;
        }

        public void UpdateFile(string id, object description){
            long ID = int.Parse(id);
            string query = $"UPDATE [File] SET Description= '{description}', Time_Insert ='{date}' WHERE ID = {ID}";
            DB_CCS.Database.ExecuteSqlCommand(query);
        }
        
        public void DeleteRelated(long related_id){
            string del = $"DELETE FROM Related WHERE ID = {related_id}' ";
            DB_CCS.Database.ExecuteSqlCommand(del);
        }
        public long InsertRelated(List<String> dept_list, string us_id){
            string query = $@"INSERT INTO Related (PK_Related , Department, UpdatedBy) 
            OUTPUT Inserted.PK_Related VALUES ";
            dept_list.ForEach(dept => {
                query += $"((SELECT TOP(1) MAX(PK_Related)+1 FROM Related), '{dept}', '{us_id}'),";
            });
            query = query.TrimEnd(',');
            
            var result = DB_CCS.Database.SqlQuery<long>(query);
            return result.First();   
        }

        public List<RelatedAlt> GetRelatedByID(long related_id){
            var sql=$@"SELECT Department
                FROM Related 
                WHERE PK_Related = {related_id};";
            var result = DB_CCS.Database.SqlQuery<RelatedAlt>(sql).ToList();
            return result; 
        }


        public List<Summernote> GetSummernote(string ID){
             string query = $"SELECT [APP/IPP] as APP , Subject , Detail, Timing FROM Topic WHERE Code =  '{ID}'";
            var result = DB_CCS.Database.SqlQuery<Summernote>(query).ToList();
            return result;
        }

        public List<ListMail> GetEmail(string user){
            var sql = "SELECT Email FROM dbo.[User] WHERE Name ='" + user + "'";
            var result = DB_CCS.Database.SqlQuery<ListMail>(sql).ToList();
            return result;
        }

        public List<ProductType> GetProductType(){
            var sql = "SELECT ID_Product_Type as ID, Name as Name FROM Product_Type WHERE ID_Product_Type BETWEEN 1 AND 8;";
            var result = DB_CCS.Database.SqlQuery<ProductType>(sql);
            return result.ToList();
        }

        public List<Department> GetDepartmentByGroup(string DepartmentGroup){
            var sql = $"SELECT ID as ID, Name, [Group] FROM Department WHERE [Group] = '{DepartmentGroup}';";
            var result = DB_CCS.Database.SqlQuery<Department>(sql);
            return result.ToList();    
        }

        public List<string> GetDepartmentGroup(){
            var sql = "SELECT [Group] FROM Department WHERE [Group] != 'Guest' GROUP BY [Group];";
            var result = DB_CCS.Database.SqlQuery<string>(sql);
            return result.ToList();    
        }
        public List<string> GetDepartment(){
            var sql = $"SELECT Name FROM Department;";
            var result = DB_CCS.Database.SqlQuery<string>(sql);
            return result.ToList();    
        }

        public List<FileItem> GetFileByID(long fk_id, string type, string topic_code, string dept){
            try{
                var sql = $"SELECT ID, FK_ID, [Type], Name, Name_Format, Description, [Size], Time_Insert, User_Insert FROM [File] WHERE [Type] = '{type}' AND Topic = '{topic_code}' AND Department = '{dept}'";
                var FileList = DB_CCS.Database.SqlQuery<FileItem>(sql).ToList();
                return FileList;
            }catch(Exception err){
                return null;
            }
        }


    }
}