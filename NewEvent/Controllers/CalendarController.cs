using NewEvent.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NewEvent.Helpers;

namespace NewEvent.Controllers{
    public class CalendarController : Controller{

        private CalendarModel M_Cal;
        private HomeModel M_Home;
        public class Production{
            public string FullName;
            public string ShortName;
        }
        public CalendarController(){
            M_Cal = new CalendarModel();
            M_Home = new HomeModel();
        }
        public ActionResult Index(){
            if ((string)(Session["User"]) == null || (string)(Session["Department"]) == null){
                Session["url"] = "Home";
                return RedirectToAction("Index", "Login");
            }
            ViewData["FormProductType"] = M_Cal.GetProductType(); //Get list of product type radio
            Production[] Productions = new Production[7];
            for(var i=1; i<=7; i++){
                Productions[i-1] = new Production{
                    FullName = $"Production {i}",
                    ShortName = $"P{i}"
                };
            }
            ViewBag.Productions = Productions;
            return View();
        }

        public ActionResult GetLineByProduction(string Production){
            try{
                if(Production.AsNullIfEmpty() != null){
                    return Json(new { status = "success", data = M_Cal.GetLineByProduction(Production) }, JsonRequestBehavior.AllowGet);
                }else{
                    throw new Exception();
                }
            }catch(Exception err){
                    return Json(new { status = "error" }, JsonRequestBehavior.AllowGet);
            }
        }
        public List<login> A = new List<login>();

    }
}