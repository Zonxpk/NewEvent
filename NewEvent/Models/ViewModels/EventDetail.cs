using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewEvent.Models{
    public class EventDetail{
        public long ID { get; set; }
        public string Model { get; set; }
        public string Event { get; set; }
        public int FG { get; set; }
        public int Qty { get; set; }
        public int NG_Qty { get; set; }
        public int Percent_NG { get; set; }
        public string Defect { get; set; }
    }
}