using NewEvent.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NewEvent.Helpers;

namespace NewEvent.Controllers{
    public class NewEventController : Controller{

        private CalendarModel M_Cal;
        public class Production{
            public string FullName;
            public string ShortName;
        }
        public NewEventController(){
            M_Cal = new CalendarModel();
        }
        public List<Production> GetProductions(){
            ViewData["FormProductType"] = M_Cal.GetProductType(); //Get list of product type radio
            List<Production> Productions = new List<Production>();
            for(var i=1; i<=7; i++){
                if(i == 3){
                    Productions.Add(new Production{
                        FullName = $"Production 3 Manual",
                        ShortName = $"P3M"
                    });

                    Productions.Add(new Production{
                        FullName = $"Production 3 Auto",
                        ShortName = $"P3A"
                    });
                }else{
                    Productions.Add(new Production{
                        FullName = $"Production {i}",
                        ShortName = $"P{i}"
                    });
                }
            }
            return Productions;
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
    }
}