import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import embed from "vega-embed";
import { HttpClient } from "@angular/common/http";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs";
import {ApparelService} from "../../services/apparel.service";
import {Company} from "../../models/company.model";

@Component({
  selector: 'app-esg-performance',
  templateUrl: './esg-performance.component.html',
  styleUrls: ['./esg-performance.component.scss']
})
export class EsgPerformanceComponent implements OnInit {
  paramsSubscription!: Subscription;
  @ViewChild('radarChartContainer', {static: false}) radarChartContainer!: ElementRef;
  environmental_disclosure_rate: number = 0;
  social_disclosure_rate: number = 0;
  governance_disclosure_rate: number = 0;
  nodata: boolean = true;
  radarChart: any;
  selectedYear: string | number = 'latest';
  selectedCompany: number = 0;
  apparelTop100: Company[] = []

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private apparelService: ApparelService,
              private renderer: Renderer2) {
    this.apparelTop100 = apparelService.getCompanies();
  }

  ngOnInit(): void {
    this.updateSection()
  }

  updateSection() {
    if (this.radarChart != null) {
      this.renderer.removeChild(this.radarChartContainer.nativeElement, this.radarChart);
    }
    this.nodata = true;
    if (this.selectedCompany != 0) {
      this.http.get<any>("https://wikirate.org/Apparel_Research_Group+Environmental_Disclosure_Rate+~" + this.selectedCompany + "+Answer.json?filter[not_ids]=&filter[company_name]=&filter[year]=" + this.selectedYear + "&limit=0&view=answer_list")
        .subscribe(response => {
          if (response.length > 0) {
            this.environmental_disclosure_rate = response[0]['value']
            this.http.get<any>("https://wikirate.org/Apparel_Research_Group+Social_Disclosure_Rate+~" + this.selectedCompany + "+Answer.json?filter[not_ids]=&filter[company_name]=&filter[year]=" + this.selectedYear + "&limit=0&view=answer_list")
              .subscribe(response => {
                if (response.length > 0) {
                  this.social_disclosure_rate = response[0]['value']
                  this.http.get<any>("https://wikirate.org/Apparel_Research_Group+Governance_Disclosure_Rate+~" + this.selectedCompany + "+Answer.json?filter[not_ids]=&filter[company_name]=&filter[year]=" + this.selectedYear + "&limit=0&view=answer_list")
                    .subscribe(response => {
                      if (response.length > 0) {
                        this.governance_disclosure_rate = response[0]['value']
                        this.nodata = false;
                        this.radarChart = this.renderer.createElement('div');
                        this.radarChart.id = "esg-performance"
                        this.radarChart.class = "radar-chart-container m-2"
                        this.renderer.appendChild(this.radarChartContainer.nativeElement, this.radarChart);
                        // @ts-ignore
                        this.updateRadarChart("of " + this.apparelService.getCompany(+this.selectedCompany).name);
                      }
                    })
                }
              })
          }
        })
    } else {
      this.http.get<any>("https://wikirate.org/Apparel_Research_Group+Environmental_Disclosure_Rate+Answer.json?filter[not_ids]=&filter[company_name]=&filter[year]=" + this.selectedYear + "&limit=0&view=answer_list")
        .subscribe(response => {
          this.environmental_disclosure_rate = 0;
          for (var i = 0; i < response.length; i++) {
            this.environmental_disclosure_rate += +response[i]['value'];
          }
          this.environmental_disclosure_rate = this.environmental_disclosure_rate / response.length;
          this.http.get<any>("https://wikirate.org/Apparel_Research_Group+Social_Disclosure_Rate+Answer.json?filter[not_ids]=&filter[company_name]=&" + this.selectedYear + "&limit=0&view=answer_list")
            .subscribe(response => {
              this.social_disclosure_rate = 0;
              for (var i = 0; i < response.length; i++) {
                this.social_disclosure_rate += +response[i]['value'];
              }
              this.social_disclosure_rate = this.social_disclosure_rate / response.length;
              this.http.get<any>("https://wikirate.org/Apparel_Research_Group+Governance_Disclosure_Rate+Answer.json?filter[not_ids]=&filter[company_name]=&filter[year]=" + this.selectedYear + "&limit=0&view=answer_list")
                .subscribe(response => {
                  this.governance_disclosure_rate = 0;
                  for (var i = 0; i < response.length; i++) {
                    this.governance_disclosure_rate += +response[i]['value'];
                  }
                  this.governance_disclosure_rate = this.governance_disclosure_rate / response.length;
                  this.nodata = false;
                  this.radarChart = this.renderer.createElement('div');
                  this.radarChart.id = "esg-performance"
                  this.radarChart.class = "m-2"
                  this.renderer.appendChild(this.radarChartContainer.nativeElement, this.radarChart);
                  this.updateRadarChart("of Apparel Top 100 (avg Rating)");
                })
            })
        })
    }
  }

  updateRadarChart(subtitle: string) {
    embed("div#esg-performance",
      {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "A radar chart example, showing multiple dimensions in a radial layout.",
        "width": 510,
        "height": 460,
        "padding": 40,
        "autosize": {"type": "none", "contains": "padding"},
        "title": {
          "text": "ESG Disclosure Rate (" + this.selectedYear + ")",
          "anchor": "middle",
          "dy": -8,
          "dx": {"signal": "-width/4"},
          "subtitle": subtitle,
          "color": "#F7F7F8",
          "subtitleColor": "#F7F7F8"
        },
        "signals": [{"name": "radius", "update": "width / 2.2"}],
        "data": [
          {
            "name": "table",
            "values": [
              {
                "key": ["Environmental", "Disclosure", "Rate"],
                "value": (Math.round(this.environmental_disclosure_rate * 100) / 100).toFixed(2),
                "category": 0
              },
              {
                "key": ["Social", "Disclosure", "Rate"],
                "value": (Math.round(this.social_disclosure_rate * 100) / 100).toFixed(2),
                "category": 0
              },
              {
                "key": ["Governance", "Disclosure", "Rate"],
                "value": (Math.round(this.governance_disclosure_rate * 100) / 100).toFixed(2),
                "category": 0
              }
            ]
          },
          {
            "name": "keys",
            "source": "table",
            "transform": [{"type": "aggregate", "groupby": ["key"]}]
          }
        ],
        "scales": [
          {
            "name": "angular",
            "type": "point",
            "range": [-3.14159, 3.14159],
            "padding": 0.5,
            "domain": {"data": "table", "field": "key"}
          },
          {
            "name": "radial",
            "type": "linear",
            "range": {"signal": "[0, radius]"},
            "zero": true,
            "nice": false,
            "domain": [0, 10],
            "domainMin": 0
          },
          {
            "name": "color",
            "type": "ordinal",
            "domain": {"data": "table", "field": "category"},
            "range": ["#F7733D", "#F7733D"]
          }
        ],
        "encode": {"enter": {"x": {"signal": "radius"}, "y": {"signal": "radius"}}},
        "marks": [
          {
            "type": "group",
            "name": "categories",
            "zindex": 1,
            "from": {
              "facet": {"data": "table", "name": "facet", "groupby": ["category"]}
            },
            "marks": [
              {
                "type": "line",
                "name": "category-line",
                "from": {"data": "facet"},
                "encode": {
                  "enter": {
                    "interpolate": {"value": "linear-closed"},
                    "x": {
                      "signal": "scale('radial', datum.value) * cos(scale('angular', datum.key))"
                    },
                    "y": {
                      "signal": "scale('radial', datum.value) * sin(scale('angular', datum.key))"
                    },
                    "stroke": {"scale": "color", "field": "category"},
                    "strokeWidth": {"value": 1},
                    "fill": {"scale": "color", "field": "category"},
                    "fillOpacity": {"value": 0.2}
                  }
                }
              },
              {
                "type": "text",
                "name": "value-text",
                "from": {"data": "category-line"},
                "encode": {
                  "enter": {
                    "x": {
                      "signal": "datum.x + 14 * cos(scale('angular', datum.datum.key))"
                    },
                    "y": {
                      "signal": "datum.y + 14 * sin(scale('angular', datum.datum.key))"
                    },
                    "text": {"signal": "datum.datum.value"},
                    "align": {"value": "center"},
                    "baseline": {"value": "middle"},
                    "fontWeight": {"value": "bold"},
                    "fill": {"value": "#F7F7F8"}
                  }
                }
              }
            ]
          },
          {
            "type": "rule",
            "name": "radial-grid",
            "from": {"data": "keys"},
            "zindex": 0,
            "encode": {
              "enter": {
                "x": {"value": 0},
                "y": {"value": 0},
                "x2": {"signal": "radius * cos(scale('angular', datum.key))"},
                "y2": {"signal": "radius * sin(scale('angular', datum.key))"},
                "stroke": {"value": "lightgray"},
                "strokeWidth": {"value": 1}
              }
            }
          },
          {
            "type": "text",
            "name": "key-label",
            "from": {"data": "keys"},
            "zindex": 1,
            "encode": {
              "enter": {
                "x": {"signal": "(radius + 11) * cos(scale('angular', datum.key))"},
                "y": {"signal": "(radius - 5) * sin(scale('angular', datum.key))"},
                "text": {"field": "key"},
                "align": [
                  {
                    "test": "abs(scale('angular', datum.key)) > PI / 2",
                    "value": "right"
                  },
                  {"value": "left"}
                ],
                "baseline": [
                  {"test": "scale('angular', datum.key) > 0", "value": "top"},
                  {"test": "scale('angular', datum.key) == 0", "value": "middle"},
                  {"value": "bottom"}
                ],
                "fill": {"value": "#F7F7F8"},
                "fontWeight": {"value": "bold"}
              }
            }
          },
          {
            "type": "line",
            "name": "outer-line",
            "from": {"data": "radial-grid"},
            "encode": {
              "enter": {
                "interpolate": {"value": "linear-closed"},
                "x": {"field": "x2"},
                "y": {"field": "y2"},
                "stroke": {"value": "#F7F7F8"},
                "strokeWidth": {"value": 1}
              }
            }
          }
        ]
      }, {
        renderer: "svg", actions: {
          source: false,
          editor: false
        }
      })

  }
}
