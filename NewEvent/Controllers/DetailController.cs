using NewEvent.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Dynamic;
using System.IO;
using System.Web;
using System.Web.Mvc;
using System.Reflection;
using NewEvent.Helpers;

namespace NewEvent.Controllers{
    public class DetailController : Controller{
        // GET: Detail
        private DetailModel M_Detail;
        private RequestModel M_Req;
        private HomeModel M_Home;
        private MailController C_Mail;
       
        public DetailController(){
            M_Detail = new DetailModel();
            M_Req = new RequestModel();
            M_Home = new HomeModel();
            C_Mail = new MailController();
            if(ViewBag.QCAudit == null) ViewBag.QCAudit = M_Home.GetQcAudit();
            if(ViewBag.PEAudit == null) ViewBag.PEAudit = M_Home.GetPEAudit();
        }
        public class Value{
            public List<string> value { get; set; }
        }

        public class RawFile{
            public HttpPostedFileBase file {get; set;}
            public string description {get; set;}
            public int id {get; set;}
        }

        private string date_ff = DateTime.Now.ToString("yyyyMMddHHmmss.fff");
        private string date = DateTime.Now.ToString("yyyyMMddHHmmss");
        public static TopicAlt Topic;
        public static long? file_id;

        public ActionResult Index(string id){
            if((string)(Session["User"]) == null || (string)(Session["Department"]) == null){
                Session["RedirectID"] = id ?? null;
                Session["RedirectMode"] = "Detail";
                return RedirectToAction("Index", "LogIn");
            }

            Session["RedirectID"] = null;

            var DepartmentGroup = M_Detail.GetDepartmentGroup(); //Get raw group of departments
            List<DepartmentList> departmentList = new List<DepartmentList>();

            foreach(string GroupName in DepartmentGroup){
                List<Department> departments = new List<Department>();
                departments = M_Detail.GetDepartmentByGroup(GroupName);
                departmentList.Add(new DepartmentList(){Name = GroupName.Replace(" ", "_"), Department = departments}); //Convert raw group into department list for radio
            }

            ViewData["DepartmentList"] = departmentList;

            var EventDetail = new EventDetail();
            var EventDetails = new EventDetail[2];
            
            EventDetail.Model = "HP1229006N0CE03";
            EventDetail.Event = "Japan";
            EventDetail.Qty = 1;
            EventDetails[0] = EventDetail;
            EventDetail = new EventDetail();
            
            EventDetail.Model = "HP1229006N0CE03";
            EventDetail.Event = "A-MO";
            EventDetail.Qty = 2;
            EventDetails[1] = EventDetail;

            ViewBag.EventDetails = EventDetails;

            return View();
        }

    }
}