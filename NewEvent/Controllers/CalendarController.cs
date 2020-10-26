using NewEvent.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NewEvent.Helpers;

namespace NewEvent.Controllers{
    public class CalendarController : NewEventController{

        private CalendarModel M_Cal;
        private HomeModel M_Home;
        private DetailModel M_Detail;
        public CalendarController(){
            M_Cal = new CalendarModel();
            M_Home = new HomeModel();
            M_Detail = new DetailModel();
        }
        public ActionResult Index(){
            if ((string)(Session["User"]) == null || (string)(Session["Department"]) == null){
                Session["url"] = "Home";
                return RedirectToAction("Index", "Login");
            }
            ViewData["FormProductType"] = M_Cal.GetProductType(); //Get list of product type radio
            ViewBag.Productions = this.GetProductions();

            var DepartmentGroup = M_Detail.GetDepartmentGroup(); //Get raw group of departments
            List<DepartmentList> departmentList = new List<DepartmentList>();

            foreach(string GroupName in DepartmentGroup){
                List<Department> departments = new List<Department>();
                departments = M_Detail.GetDepartmentByGroup(GroupName);
                departmentList.Add(new DepartmentList(){Name = GroupName.Replace(" ", "_"), Department = departments}); //Convert raw group into department list for radio
            }
            ViewData["DepartmentList"] = departmentList;
            return View();
        }

        public List<login> A = new List<login>();

    }
}