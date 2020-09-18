using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewEvent.Models
{
    public class DepartmentList{
        public string Name { get; set; }
        public List<Department> Department { get; set; }
    }
}