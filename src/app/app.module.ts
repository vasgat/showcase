import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from "./header/header.component";
import {IntroComponent} from './dynamic-report/intro/intro.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {SuppliersMapComponent} from './dynamic-report/suppliers-map/suppliers-map.component';
import {NetworkGraphComponent} from './dynamic-report/network-graph/network-graph.component';
import {DynamicReportComponent} from './dynamic-report/dynamic-report.component';
import { MarketCapMapComponent } from './dynamic-report/market-cap-map/market-cap-map.component';
import { SummaryComponent } from './dynamic-report/summary/summary.component';
import { SupplierListsOnWikirateComponent } from './dynamic-report/supplier-lists-on-wikirate/supplier-lists-on-wikirate.component';
import { NumberOfSuppliersPerCompanyComponent } from './dynamic-report/number-of-suppliers-per-company/number-of-suppliers-per-company.component';
import {RouterModule} from "@angular/router";
import { FooterComponent } from './footer/footer.component';
import { MoreDataComponent } from './dynamic-report/more-data/more-data.component';
import { AboutComponent } from './about/about.component';
import {ApparelService} from "./services/apparel.service";
import { FilterPipe } from './filter.pipe';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { TextHighlightDirective } from './directives/text-highlight.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    IntroComponent,
    SuppliersMapComponent,
    NetworkGraphComponent,
    DynamicReportComponent,
    MarketCapMapComponent,
    SummaryComponent,
    SupplierListsOnWikirateComponent,
    NumberOfSuppliersPerCompanyComponent,
    FooterComponent,
    MoreDataComponent,
    AboutComponent,
    FilterPipe,
    TextHighlightDirective
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    NgbModule
  ],
  providers: [ApparelService],
  bootstrap: [AppComponent]
})
export class AppModule {
}